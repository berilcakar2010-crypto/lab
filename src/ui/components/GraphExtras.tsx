/**
 * Knowledge-graph additions: depth of mastery, "why it matters / where it
 * leads" from real edges, the learner's own work on a topic, their own
 * concepts (add, rename, archive) and rolling back a graph update.
 */
import { useState } from "react";
import type { LabDB } from "../../domain/types";
import { DOMAINS, domainLabel, type Domain, type KnowledgeGraph } from "../../knowledge/schema";
import { L, fmtDate } from "../../i18n";
import { DEPTH_LABEL, DEPTH_LEVELS, confidenceReport, depthReport, examVsResearch, lastMasteryChange, masteryState, MASTERY_STATE_LABEL } from "../../adaptive/depth";
import { masteryProfile } from "../../adaptive/mastery";
import { explorationQuestions, whereLeads, whyMatters } from "../../adaptive/discovery";
import { ARTIFACT_LABEL, JOURNAL_LABEL, addJournal, artifactsFor, journalFor } from "../../academic/records";
import { addUserConcept, archiveConcept, renameConcept, rollbackable, rollbackLastUpdate } from "../../knowledge/userContent";
import { act, navigate, store, toast, useDB } from "../state";
import { Icon } from "./common";

const pct = (x: number | null) => (x === null ? "—" : `${Math.round(x * 100)}%`);

export function DepthCard({ loId }: { loId: string }) {
  const db = useDB();
  const d = depthReport(db, loId);
  const p = masteryProfile(db, loId);
  const st = masteryState(p);
  const er = examVsResearch(db, loId);
  const conf = confidenceReport(db, loId);
  const ch = lastMasteryChange(db, loId);
  return (
    <section className="stack depth-card" style={{ gap: 8 }}>
      <div className="row between nowrap">
        <strong>{L("Depth", "Derinlik")}</strong>
        <span className={`chip ${st === "VERIFIED" ? "s-MASTERED" : st === "STALE" ? "s-NEEDS_REVIEW" : ""}`}>{MASTERY_STATE_LABEL(st)}</span>
      </div>
      <ol className="depth-ladder">
        {DEPTH_LEVELS.map((lv) => <li key={lv} className={d.reached.includes(lv) ? "on" : ""}>{DEPTH_LABEL(lv)}</li>)}
      </ol>
      {d.next && <span className="tiny text-2">{L("Next level", "Sonraki seviye")}: {DEPTH_LABEL(d.next.level)} — {d.next.needs}</span>}
      <div className="grid-2">
        <div className="tiny"><span className="muted">{L("Exam mastery", "Sınav ustalığı")}</span><br /><span className="mono">{pct(er.exam)}</span></div>
        <div className="tiny"><span className="muted">{L("Research mastery", "Araştırma ustalığı")}</span><br /><span className="mono">{pct(er.research)}</span></div>
      </div>
      {conf.mean !== null && (
        <span className="tiny text-2">{L(`Your confidence: ${pct(conf.mean)} (n=${conf.n})`, `Güvenin: ${pct(conf.mean)} (n=${conf.n})`)}{conf.calibrationGap !== null && Math.abs(conf.calibrationGap) >= 0.15 ? (conf.calibrationGap > 0 ? L(" — higher than your results", " — sonuçlarından yüksek") : L(" — lower than your results", " — sonuçlarından düşük")) : ""}</span>
      )}
      {ch && <span className="tiny muted">{L("Last change", "Son değişim")} ({fmtDate(ch.at)}): {pct(ch.before)} → {pct(ch.after)} · {ch.because}</span>}
    </section>
  );
}

export function WhyAndWhere({ db, g, loId, onOpen }: { db: LabDB; g: KnowledgeGraph; loId: string; onOpen: (id: string) => void }) {
  const w = whyMatters(g, loId);
  const l = whereLeads(db, g, loId);
  const xq = explorationQuestions(g, loId);
  if (!w || !l) return null;
  const chip = (id: string) => <button key={id} className="chip" onClick={() => onOpen(id)}>{g.objects[id]?.title ?? id}</button>;
  return (
    <section className="stack" style={{ gap: 6 }}>
      <h3 style={{ margin: 0 }}>{L("Where does this lead?", "Bu nereye götürür?")}</h3>
      <p className="tiny text-2" style={{ margin: 0 }}>{w.summary}</p>
      {l.next.length > 0 && <div className="row" style={{ gap: 4 }}><span className="tiny muted">{L("Next:", "Sonra:")}</span>{l.next.slice(0, 8).map(chip)}</div>}
      {l.further.length > 0 && <div className="row" style={{ gap: 4 }}><span className="tiny muted">{L("Further:", "Daha ileride:")}</span>{l.further.slice(0, 6).map(chip)}</div>}
      {l.domains.length > 1 && <span className="tiny muted">{L("Fields ahead: ", "Öndeki alanlar: ")}{l.domains.join(", ")}</span>}
      {l.projects.length > 0 && <div className="row" style={{ gap: 4 }}><span className="tiny muted">{L("Your projects:", "Projelerin:")}</span>{l.projects.map((p) => <button key={p.id} className="chip" onClick={() => navigate(`/work?tab=projects&id=${p.id}`)}>{p.title}</button>)}</div>}
      {xq.length > 0 && (
        <details>
          <summary className="tiny muted" style={{ cursor: "pointer" }}>{L("Potential exploration questions", "Olası keşif soruları")}</summary>
          <ul className="small text-2 tight">{xq.map((q) => <li key={q}>{q}</li>)}</ul>
          <span className="tiny muted">{L("Generated from the graph; not claimed to be open research problems.", "Grafikten üretildi; açık araştırma problemi olduğu iddia edilmiyor.")}</span>
        </details>
      )}
    </section>
  );
}

/** What the learner actually did on this topic: journal entries and artifacts. */
export function YourWork({ loId }: { loId: string }) {
  const db = useDB();
  const [text, setText] = useState("");
  const js = journalFor(db, loId);
  const arts = artifactsFor(db, loId);
  return (
    <section className="stack" style={{ gap: 6 }}>
      <h3 style={{ margin: 0 }}>{L("Your work on this", "Bu konudaki çalışmaların")}</h3>
      {!js.length && !arts.length && <span className="tiny muted">{L("Nothing yet. A thought, a question, a derivation — anything you write here stays linked to this topic.", "Henüz bir şey yok. Bir düşünce, bir soru, bir türetme — buraya yazdığın her şey bu konuya bağlı kalır.")}</span>}
      {arts.map((a) => <div key={a.id} className="row nowrap small"><span className="chip">{ARTIFACT_LABEL(a.kind)}</span><span className="grow truncate">{a.title}</span></div>)}
      {js.slice(0, 5).map((j) => <div key={j.id} className="small"><span className="tiny muted">{JOURNAL_LABEL(j.kind)} · {fmtDate(j.createdAt)}</span><br />{j.text}</div>)}
      <div className="row nowrap" style={{ gap: 6 }}>
        <input className="input grow" value={text} onChange={(e) => setText(e.target.value)} placeholder={L("A thought or question about this…", "Bununla ilgili bir düşünce ya da soru…")} aria-label={L("Journal", "Günlük")} />
        <button className="btn small" disabled={!text.trim()} onClick={() => { act((d) => addJournal(d, { kind: text.trim().endsWith("?") ? "QUESTION" : "IDEA", text, loIds: [loId] })); setText(""); }}><Icon.plus /></button>
      </div>
    </section>
  );
}

/** Rename (id kept) or archive a concept — through the versioned update pipeline. */
export function ConceptAdmin({ g, loId }: { g: KnowledgeGraph; loId: string }) {
  const o = g.objects[loId];
  const [title, setTitle] = useState(o.title);
  const run = (fn: () => void, ok: string) => {
    try {
      fn();
      toast(ok);
    } catch (e) {
      toast(e instanceof Error ? e.message : String(e), "error");
    }
  };
  return (
    <details>
      <summary className="tiny muted" style={{ cursor: "pointer" }}>{L("Edit this concept", "Bu kavramı düzenle")}</summary>
      <div className="stack" style={{ gap: 6, marginTop: 6 }}>
        {loId.startsWith("user.") && <div className="row nowrap" style={{ gap: 6 }}>
          <input className="input grow" value={title} onChange={(e) => setTitle(e.target.value)} aria-label={L("Title", "Başlık")} />
          <button className="btn small" disabled={!title.trim() || title === o.title} onClick={() => run(() => store.transact((d) => renameConcept(d, loId, title)), L("Renamed. The id stays; the old name still finds it.", "Yeniden adlandırıldı. ID aynı kalır; eski ad da onu bulur."))}>{L("Rename", "Yeniden adlandır")}</button>
        </div>}
        {(o.aliases ?? []).length > 0 && <span className="tiny muted">{L("Also known as: ", "Diğer adları: ")}{o.aliases!.join(", ")}</span>}
        {o.status === "AKTIF" || o.status === "TASLAK" ? (
          <button className="btn small ghost" style={{ alignSelf: "flex-start" }} onClick={() => confirm(L("Archive this concept? It stays as history with all progress; it can be rolled back.", "Bu kavram arşivlensin mi? Tüm ilerlemeyle birlikte geçmiş olarak kalır; geri alınabilir.")) && run(() => store.transact((d) => archiveConcept(d, loId, L("archived by the learner", "öğrenci tarafından arşivlendi"))), L("Archived.", "Arşivlendi."))}>{L("Archive", "Arşivle")}</button>
        ) : null}
        <span className="tiny muted">{L("Every change is a new graph version and can be rolled back from Version.", "Her değişiklik yeni bir grafik sürümüdür ve Sürüm'den geri alınabilir.")}</span>
      </div>
    </details>
  );
}

export function AddConceptForm({ g, initial }: { g: KnowledgeGraph; initial?: string }) {
  const [title, setTitle] = useState(initial ?? "");
  const [domain, setDomain] = useState<Domain>("MATEMATIK");
  const [objectives, setObjectives] = useState("");
  const [desc, setDesc] = useState("");
  const [pre, setPre] = useState("");
  const [open, setOpen] = useState(!!initial);
  if (!open) return <button className="btn small" style={{ alignSelf: "flex-start" }} onClick={() => setOpen(true)}><Icon.plus /> {L("Add your own concept", "Kendi kavramını ekle")}</button>;
  const preIds = pre.split(",").map((x) => x.trim()).filter(Boolean).map((t) => g.order.find((id) => id === t || g.objects[id].title.toLocaleLowerCase() === t.toLocaleLowerCase())).filter((x): x is string => !!x);
  return (
    <section className="card stack" style={{ gap: 8 }}>
      <h2>{L("Your own concept", "Kendi kavramın")}</h2>
      <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={L("Title", "Başlık")} aria-label={L("Title", "Başlık")} />
      <select className="input" value={domain} onChange={(e) => setDomain(e.target.value as Domain)} aria-label={L("Field", "Alan")}>{DOMAINS.map((d) => <option key={d} value={d}>{domainLabel(d)}</option>)}</select>
      <textarea className="textarea" style={{ minHeight: 60 }} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder={L("What is it? (optional)", "Bu ne? (isteğe bağlı)")} aria-label={L("Description", "Açıklama")} />
      <textarea className="textarea" style={{ minHeight: 60 }} value={objectives} onChange={(e) => setObjectives(e.target.value)} placeholder={L("What can someone who knows it do? One per line, e.g. “Estimate the damping time of a pendulum”", "Bunu bilen biri ne yapabilir? Her satıra bir tane, ör. “Bir sarkacın sönüm süresini tahmin eder”")} aria-label={L("Objectives", "Hedefler")} />
      <input className="input" value={pre} onChange={(e) => setPre(e.target.value)} placeholder={L("Required prerequisites (titles or ids, comma-separated)", "Zorunlu önkoşullar (başlık ya da ID, virgülle)")} aria-label={L("Prerequisites", "Önkoşullar")} />
      {pre.trim() && <span className="tiny muted">{L("Found: ", "Bulunan: ")}{preIds.map((id) => g.objects[id].title).join(", ") || "—"}</span>}
      <div className="row" style={{ gap: 6 }}>
        <button className="btn primary" disabled={!title.trim() || !objectives.trim()} onClick={() => {
          try {
            const id = store.transact((d) => addUserConcept(d, { title, domain, description: desc, learningObjectives: objectives.split("\n"), prerequisites: preIds }));
            toast(L("Added to the graph as your own (user-created) concept.", "Grafiğe senin (kullanıcı oluşturdu) kavramın olarak eklendi."));
            setOpen(false);
            navigate(`/graph?lo=${encodeURIComponent(id)}`);
          } catch (e) {
            toast(e instanceof Error ? e.message : String(e), "error");
          }
        }}>{L("Validate and add", "Doğrula ve ekle")}</button>
        <button className="btn ghost" onClick={() => setOpen(false)}>{L("Cancel", "Vazgeç")}</button>
      </div>
    </section>
  );
}

export function RollbackButton() {
  const db = useDB();
  const last = rollbackable(db);
  if (!last) return null;
  return (
    <button className="btn small ghost" style={{ alignSelf: "flex-start" }} onClick={() => {
      if (!confirm(L(`Roll back v${last.toVersion} (${last.summary})? The history is kept.`, `v${last.toVersion} (${last.summary}) geri alınsın mı? Geçmiş korunur.`))) return;
      const r = act((d) => rollbackLastUpdate(d));
      toast(r ? L(`Rolled back. Now v${r.toVersion}.`, `Geri alındı. Şimdi v${r.toVersion}.`) : L("Only the latest update can be rolled back.", "Yalnızca en son güncelleme geri alınabilir."));
    }}>{L(`Roll back v${last.toVersion}`, `v${last.toVersion} sürümünü geri al`)}</button>
  );
}
