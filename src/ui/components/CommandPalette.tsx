/**
 * Global search and quick actions (Ctrl/⌘ K, "/", or the search button):
 * concepts, milestones, questions, sources, projects, research, journal,
 * goals and artifacts — each with what it is, how it relates, and its state —
 * plus verbs: learn X, practise X, review, continue, start research, add a
 * concept or source, ask AI, write in the journal, surprise me.
 */
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { L } from "../../i18n";
import { getGraph } from "../../knowledge/graph";
import { DEFAULT_ACTIONS, globalSearch, parseQuickAction, SEARCH_TYPE_LABEL, type QuickAction } from "../../adaptive/search";
import { openLab, surpriseMe } from "../../adaptive/entry";
import { createResearch } from "../../adaptive/research";
import { addSource } from "../../adaptive/provenance";
import { addJournal } from "../../academic/records";
import { logEvent } from "../../engines/analytics";
import { act, aiHost, navigate, store, toast, useDB } from "../state";
import { canEmbed, semanticSearch, type SemanticHit } from "../../ai/semantic";
import { makeProvider } from "../../ai/providers";
import { followEntry, UnsureSheet } from "./OpenLab";
import { Icon } from "./common";

let isOpen = false;
const listeners = new Set<() => void>();
const set = (v: boolean) => { isOpen = v; listeners.forEach((l) => l()); };
export const openPalette = () => set(true);
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };

export function CommandPalette() {
  const open = useSyncExternalStore(subscribe, () => isOpen);
  const [unsure, setUnsure] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) { e.preventDefault(); set(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const g = getGraph(store.state.knowledge);
  return (
    <>
      {open && <Palette onClose={() => set(false)} onUnsure={() => { set(false); setUnsure(true); }} />}
      {unsure && <UnsureSheet g={g} onClose={() => setUnsure(false)} />}
    </>
  );
}

function Palette({ onClose, onUnsure }: { onClose: () => void; onUnsure: () => void }) {
  const db = useDB();
  const g = getGraph(db.knowledge);
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => input.current?.focus(), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const action = parseQuickAction(q);
  const [semantic, setSemantic] = useState<SemanticHit[] | null>(null);
  const [semBusy, setSemBusy] = useState(false);
  const embedOk = canEmbed(makeProvider(db.preferences));
  const runSemantic = async () => {
    setSemBusy(true);
    try {
      setSemantic(await semanticSearch(aiHost, g, action?.arg || q, 8));
    } catch {
      toast(L("Semantic search is unavailable right now — the normal search still works.", "Anlamsal arama şu an kullanılamıyor — normal arama çalışmaya devam ediyor."), "error");
    }
    setSemBusy(false);
  };
  const results = useMemo(() => globalSearch(db, g, action?.arg || q, 20), [q, db.events.length, g]);
  const go = (href: string) => { onClose(); navigate(href); };
  const best = (text: string) => globalSearch(store.state, g, text, 5).find((r) => r.type === "CONCEPT");

  const run = (a: QuickAction) => {
    act((d) => logEvent(d, "SEARCH", {}, { action: a.kind, query: a.arg.slice(0, 80) }));
    switch (a.kind) {
      case "LEARN": return go(`/build?q=${encodeURIComponent(a.arg)}`);
      case "PRACTICE": {
        const c = best(a.arg);
        const ms = c && Object.values(store.state.milestones).find((m) => m.learningObjectIds?.includes(c.id) && !m.masteredAt && !m.ephemeral);
        return ms ? go(`/session/${ms.id}`) : c ? go(c.href) : toast(L("Nothing to practise matches that yet.", "Buna uyan pratik yapılacak bir şey henüz yok."));
      }
      case "REVIEW": return go("/study?tab=topics");
      case "CONTINUE": {
        const e = openLab(store.state, g).primary;
        onClose();
        return e ? followEntry(e, "palette") : navigate("/");
      }
      case "RESEARCH": {
        if (!a.arg) return go("/study?tab=research");
        const c = best(a.arg);
        const r = act((d) => createResearch(d, a.arg, c ? [c.id] : []));
        return go(`/study?tab=research&res=${r.id}`);
      }
      case "ADD_CONCEPT": return go(`/graph?view=surum&add=${encodeURIComponent(a.arg)}`);
      case "ADD_SOURCE": {
        if (!a.arg) return;
        act((d) => addSource(d, { title: a.arg, type: "TEXTBOOK" }));
        toast(L("Source added. Link it to topics from a topic's page.", "Kaynak eklendi. Bir konunun sayfasından konulara bağlayabilirsin."));
        return onClose();
      }
      case "ASK": {
        const c = best(a.arg);
        return c ? go(`/graph?lo=${encodeURIComponent(c.id)}&tab=ask`) : go("/study?tab=chats");
      }
      case "JOURNAL": {
        if (!a.arg) return go("/work?tab=journal");
        act((d) => addJournal(d, { kind: "IDEA", text: a.arg }));
        toast(L("Saved to your journal.", "Günlüğüne kaydedildi."));
        return onClose();
      }
      case "SURPRISE": {
        const e = surpriseMe(store.state, g);
        onClose();
        return e ? followEntry(e, "palette") : toast(L("Nothing new fits right now.", "Şu an uyan yeni bir şey yok."));
      }
      case "UNSURE": return onUnsure();
    }
  };

  return createPortal(
    <div className="sheet-backdrop palette-backdrop" role="presentation" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet palette" role="dialog" aria-modal="true" aria-label={L("Search and quick actions", "Arama ve hızlı komutlar")}>
        <div className="row nowrap" style={{ gap: 8 }}>
          <Icon.search />
          <input ref={input} className="input grow" value={q} onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { if (action) run(action); else if (results[0]) go(results[0].href); } }}
            placeholder={L("Search, or: learn Fourier transforms · practise derivatives · surprise me", "Ara ya da: öğren Fourier dönüşümü · pratik türev · beni şaşırt")} aria-label={L("Search", "Ara")} />
        </div>
        <div className="list palette-list">
          {action && (
            <button className="list-item palette-action" onClick={() => run(action)}>
              <Icon.spark /><span className="grow">{action.label}{action.arg ? `: ${action.arg}` : ""}</span><span className="tiny muted">↵</span>
            </button>
          )}
          {!q.trim() && DEFAULT_ACTIONS().map((a) => (
            <button key={a.kind} className="list-item" onClick={() => run(a)}><Icon.arrow /><span className="grow">{a.label}</span></button>
          ))}
          {results.map((r) => (
            <button key={`${r.type}:${r.id}`} className="list-item" onClick={() => { act((d) => logEvent(d, "SEARCH", {}, { open: r.type })); go(r.href); }}>
              <span className="chip">{SEARCH_TYPE_LABEL(r.type)}</span>
              <span className="grow stack" style={{ gap: 0, minWidth: 0, textAlign: "left" }}>
                <span className="truncate">{r.title}</span>
                <span className="tiny muted truncate">{r.context}{r.state ? ` · ${r.state}` : ""}</span>
              </span>
            </button>
          ))}
          {embedOk && q.trim().length >= 3 && (
            <button className="list-item palette-action" disabled={semBusy} onClick={runSemantic}>
              {semBusy ? <span className="spinner" /> : <Icon.bulb />}<span className="grow">{L("Search by meaning (AI)", "Anlama göre ara (YZ)")}</span><span className="tiny muted">{L("sends only the query", "yalnızca sorgu gönderilir")}</span>
            </button>
          )}
          {semantic && semantic.map((h) => (
            <button key={`sem:${h.id}`} className="list-item" onClick={() => go(`/graph?lo=${encodeURIComponent(h.id)}`)}>
              <span className="chip">{L("Meaning", "Anlam")}</span>
              <span className="grow stack" style={{ gap: 0, minWidth: 0, textAlign: "left" }}><span className="truncate">{g.objects[h.id]?.title}</span><span className="tiny muted">{g.objects[h.id]?.field} · {Math.round(h.score * 100)}%</span></span>
            </button>
          ))}
          {q.trim().length >= 2 && !results.length && !action && <p className="small muted" style={{ padding: 10 }}>{L("Nothing found. Try “learn …” to build it.", "Bir şey bulunamadı. Oluşturmak için “öğren …” dene.")}</p>}
        </div>
      </div>
    </div>,
    document.body,
  );
}
