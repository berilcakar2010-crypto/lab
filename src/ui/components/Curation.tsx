/**
 * Curation UI: where content comes from (sources and provenance) and the
 * review-and-approve screen for AI curriculum proposals (diff → approval).
 */
import { useState } from "react";
import type { ID } from "../../domain/types";
import { SOURCE_TYPES, type CurriculumProposal, type SourceType } from "../../domain/adaptive";
import { fmtDate, L } from "../../i18n";
import { getGraph } from "../../knowledge/graph";
import { SOURCE_TYPE_LABEL, addSection, addSource, mapSection, provenanceOf, sourcesForObject, verifyProvenance } from "../../adaptive/provenance";
import { CHANGE_KIND_LABEL, decideProposal, reviewNotes, withDependencies } from "../../adaptive/generator";
import { GRANULARITY_LABEL } from "../../adaptive/granularity";
import { reviewProposalAI } from "../../ai/adaptiveAI";
import { act, aiHost, navigate, toast, useAsync, useDB } from "../state";
import { Sheet } from "./common";

export function SourcesBlock({ loId }: { loId: string }) {
  const db = useDB();
  const g = getGraph(db.knowledge);
  const prov = provenanceOf(db, g, loId);
  const list = sourcesForObject(db, g, loId);
  const [adding, setAdding] = useState(false);
  const [srcId, setSrcId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<SourceType>("TEXTBOOK");
  const [section, setSection] = useState("");
  const add = () => {
    act((d) => {
      const sid = srcId || addSource(d, { title, type }).id;
      const { sectionId } = addSection(d, sid, section || title, [loId]);
      mapSection(d, sid, sectionId, [loId]);
    });
    setAdding(false); setTitle(""); setSection(""); setSrcId("");
    toast(L("Source linked to this topic.", "Kaynak bu konuya bağlandı."));
  };
  return (
    <section className="stack" style={{ gap: 6 }}>
      <div className="row between nowrap">
        <strong>{L("Sources & provenance", "Kaynaklar ve köken")}</strong>
        <span className={`chip ${prov.verification === "VERIFIED" ? "s-MASTERED" : ""}`}>{prov.verification === "VERIFIED" ? L("Verified", "Doğrulandı") : L("Unverified", "Doğrulanmadı")}</span>
      </div>
      <span className="tiny text-2">
        {SOURCE_TYPE_LABEL(prov.sourceType)}{prov.source ? ` · ${prov.source}` : ""}{prov.generatedByAI ? ` · ${L("AI-generated", "YZ üretimi")}` : ""}
        {prov.lastVerifiedAt ? ` · ${L("verified", "doğrulandı")} ${fmtDate(prov.lastVerifiedAt)}${prov.verifiedBy ? ` (${prov.verifiedBy})` : ""}` : ""}
      </span>
      {prov.verification !== "VERIFIED" && <button className="btn small ghost" style={{ alignSelf: "flex-start" }} onClick={() => confirm(L("Did you check this content against a source yourself?", "Bu içeriği bir kaynakla kendin karşılaştırdın mı?")) && act((d) => verifyProvenance(d, loId))}>{L("I checked it against a source", "Bir kaynakla karşılaştırdım")}</button>}
      {list.length > 0 && (
        <div className="list">
          {list.map((s, i) => (
            <div key={i} className="list-item small">
              <span className="grow stack" style={{ gap: 0, minWidth: 0 }}>
                <span className="truncate">{s.url ? <a href={s.url} target="_blank" rel="noreferrer">{s.title}</a> : s.title}</span>
                <span className="tiny muted">{SOURCE_TYPE_LABEL(s.type)}{s.section ? ` · ${s.section}` : ""} · {s.origin === "yours" ? L("your source", "senin kaynağın") : L("Lab list", "Lab listesi")}</span>
              </span>
            </div>
          ))}
        </div>
      )}
      {!adding ? <button className="btn small ghost" style={{ alignSelf: "flex-start" }} onClick={() => setAdding(true)}>{L("+ A book or course that teaches this", "+ Bunu anlatan bir kitap ya da kurs")}</button> : (
        <div className="card stack" style={{ gap: 6 }}>
          <select className="input" value={srcId} onChange={(e) => setSrcId(e.target.value)} aria-label={L("Source", "Kaynak")}>
            <option value="">{L("New source…", "Yeni kaynak…")}</option>
            {Object.values(db.sources).map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
          {!srcId && (
            <div className="row nowrap" style={{ gap: 6 }}>
              <input className="input grow" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={L("Title, e.g. Thomas' Calculus", "Başlık, ör. Thomas Kalkülüs")} aria-label={L("Title", "Başlık")} />
              <select className="input" style={{ width: "auto" }} value={type} onChange={(e) => setType(e.target.value as SourceType)} aria-label={L("Type", "Tür")}>
                {SOURCE_TYPES.filter((t) => t !== "AI_GENERATED").map((t) => <option key={t} value={t}>{SOURCE_TYPE_LABEL(t)}</option>)}
              </select>
            </div>
          )}
          <input className="input" value={section} onChange={(e) => setSection(e.target.value)} placeholder={L("Chapter / section (optional)", "Bölüm (isteğe bağlı)")} aria-label={L("Section", "Bölüm")} />
          <div className="row" style={{ gap: 6 }}>
            <button className="btn small primary" disabled={!srcId && !title.trim()} onClick={add}>{L("Link", "Bağla")}</button>
            <button className="btn small ghost" onClick={() => setAdding(false)}>{L("Cancel", "Vazgeç")}</button>
          </div>
          <span className="tiny muted">{L("A book is a source, not a curriculum: its chapters are mapped onto the same graph.", "Kitap bir kaynaktır, müfredat değil: bölümleri aynı grafiğe eşlenir.")}</span>
        </div>
      )}
    </section>
  );
}

/** Review an AI curriculum proposal: every change, its validity, and the learner's decision. */
export function ProposalReview({ id, onClose }: { id: ID; onClose: () => void }) {
  const db = useDB();
  const p: CurriculumProposal | undefined = db.curriculumProposals[id];
  const g = getGraph(db.knowledge);
  const [sel, setSel] = useState<Set<ID>>(() => new Set(p?.changes.filter((c) => c.valid).map((c) => c.id) ?? []));
  const [aiNotes, setAiNotes] = useState<string[] | null>(null);
  const { busy, run } = useAsync();
  if (!p) return null;
  const decided = p.status !== "PENDING";
  const toggle = (cid: ID) => {
    const next = new Set(sel);
    if (next.has(cid)) next.delete(cid);
    else for (const x of withDependencies(p, [cid])) next.add(x);
    setSel(next);
  };
  const decide = (s: "all" | "none" | ID[]) => {
    const r = act((d) => decideProposal(d, id, s));
    if (!r.ok) { toast(r.errors.join(" "), "error"); return; }
    toast(r.status === "REJECTED" ? L("Proposal rejected — nothing changed.", "Öneri reddedildi — hiçbir şey değişmedi.") : L(`Applied${r.appliedVersion ? ` as graph version ${r.appliedVersion}` : ""}.`, `Uygulandı${r.appliedVersion ? ` (grafik sürümü ${r.appliedVersion})` : ""}.`));
    onClose();
    if (r.courseId) navigate(`/course/${r.courseId}`);
  };
  const notes = [...p.notes, ...reviewNotes(p)];
  return (
    <Sheet title={L("Curriculum proposal", "Müfredat önerisi")} onClose={onClose} wide>
      <div className="stack" style={{ gap: 10 }}>
        <p className="small text-2" style={{ margin: 0 }}>“{p.request}” · {p.generatedBy === "engine" ? L("from the graph (no AI)", "grafikten (YZ yok)") : `${L("AI", "YZ")}: ${p.generatedBy}`}</p>
        {notes.map((n, i) => <div key={i} className="banner info small">{n}</div>)}
        {aiNotes?.map((n, i) => <div key={`ai${i}`} className="banner small">{L("Reviewer", "Gözden geçirici")}: {n}</div>)}
        {!decided && <button className="btn small ghost" style={{ alignSelf: "flex-start" }} disabled={busy} onClick={() => run(async () => setAiNotes((await reviewProposalAI(aiHost, p)).value))}>{busy ? <span className="spinner" /> : L("Second opinion (reviewer)", "İkinci görüş (gözden geçirici)")}</button>}
        {p.reused.length > 0 && <span className="small">{L("Reused (not duplicated)", "Yeniden kullanılan (kopyalanmadı)")}: {p.reused.map((x) => g.objects[x]?.title ?? x).join(", ")}</span>}
        {p.missingPrereqs.length > 0 && <span className="small">{L("Prerequisites not yet verified for you", "Senin için henüz doğrulanmamış önkoşullar")}: {p.missingPrereqs.map((x) => g.objects[x]?.title ?? x).join(", ")}</span>}
        <div className="card list proposal-diff">
          {p.changes.map((c) => {
            const m = c.kind === "ADD_MILESTONE" ? p.milestones.find((x) => x.key === c.target) : undefined;
            return (
              <label key={c.id} className={`list-item diff-row ${c.valid ? "" : "invalid"}`} style={{ alignItems: "flex-start" }}>
                <input type="checkbox" disabled={!c.valid || decided} checked={sel.has(c.id) && c.valid} onChange={() => toggle(c.id)} style={{ marginTop: 4 }} />
                <span className="grow stack" style={{ gap: 2, minWidth: 0 }}>
                  <span className="small"><span className="mono diff-kind">{CHANGE_KIND_LABEL(c.kind)}</span> {c.title}</span>
                  {c.detail && <span className="tiny muted">{c.detail}</span>}
                  {m && <span className="tiny text-2">{m.capability.capability} · {m.granularity.status.map(GRANULARITY_LABEL).join(", ")}</span>}
                  {c.issues.map((x, i) => <span key={i} className="tiny" style={{ color: "var(--danger)" }}>{x}</span>)}
                </span>
              </label>
            );
          })}
          {!p.changes.length && <p className="small muted" style={{ padding: 10 }}>{L("No changes to approve.", "Onaylanacak değişiklik yok.")}</p>}
        </div>
        {p.graphErrors.length > 0 && <div className="banner error small">{p.graphErrors.join(" · ")}</div>}
        {decided ? (
          <span className="small">{L("Decision", "Karar")}: {p.status}{p.appliedVersion ? ` · v${p.appliedVersion}` : ""}</span>
        ) : (
          <div className="row" style={{ gap: 6 }}>
            <button className="btn primary" disabled={!p.changes.some((c) => c.valid)} onClick={() => decide("all")}>{L("Approve all valid", "Geçerlilerin tümünü onayla")}</button>
            <button className="btn" disabled={!sel.size} onClick={() => decide([...sel])}>{L(`Approve selected (${sel.size})`, `Seçilenleri onayla (${sel.size})`)}</button>
            <button className="btn ghost" onClick={() => decide("none")}>{L("Reject all", "Tümünü reddet")}</button>
          </div>
        )}
        <span className="tiny muted">{L("Nothing is applied before you approve. Invalid changes cannot be approved. New nodes stay marked AI-generated and unverified.", "Sen onaylamadan hiçbir şey uygulanmaz. Geçersiz değişiklikler onaylanamaz. Yeni düğümler YZ üretimi ve doğrulanmamış olarak işaretli kalır.")}</span>
      </div>
    </Sheet>
  );
}
