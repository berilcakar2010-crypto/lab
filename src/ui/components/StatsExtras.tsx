/**
 * Statistics beyond counts: depth of knowledge (breadth, depth, retention,
 * transfer, research), personal records, insights with their data and sample
 * size, observed learning preferences (behaviour, never personality), and
 * where the learner goes deepest.
 */
import { useMemo } from "react";
import { L, fmtDate } from "../../i18n";
import { getGraph } from "../../knowledge/graph";
import { depthAnalytics, DEPTH_SCALE, personalRecords } from "../../academic/portfolio";
import { academicProfile, observedPreferences, trendInsights } from "../../adaptive/personalModel";
import { useDB } from "../state";
import { SKILL_LABEL, competitionReport, languageReports } from "../../academic/layers";
import { StatTile } from "./Stats";
import { Bar } from "./common";

const pct = (x: number | null) => (x === null ? null : L(`${Math.round(x * 100)}%`, `%${Math.round(x * 100)}`));

export function DepthOfKnowledge() {
  const db = useDB();
  const g = getGraph(db.knowledge);
  const d = useMemo(() => depthAnalytics(db, g), [db.events.length, g]);
  return (
    <section className="stack">
      <h2>{L("Depth of knowledge", "Bilginin derinliği")}</h2>
      <div className="grid-3">
        <StatTile label={L("Breadth", "Genişlik")} value={d.breadth.concepts} note={L(`concepts shown · ${d.breadth.domains} fields`, `gösterilen kavram · ${d.breadth.domains} alan`)} />
        <StatTile label={L("Depth", "Derinlik")} value={d.depth.mean === null ? null : `${d.depth.mean.toFixed(1)} / ${DEPTH_SCALE}`} needed={L("no evidence yet", "henüz kanıt yok")} note={L(`mean level over ${d.depth.n} concepts (seen → research)`, `${d.depth.n} kavramda ortalama seviye (gördüm → araştırma)`)} />
        <StatTile label={L("Retention", "Kalıcılık")} value={pct(d.retention.fresh)} needed={L("no evidence yet", "henüz kanıt yok")} note={L(`fresh among ${d.retention.n} shown concepts`, `gösterilen ${d.retention.n} kavram içinde taze`)} />
        <StatTile label="Transfer" value={pct(d.transfer.mean)} needed={L("no transfer evidence", "transfer kanıtı yok")} note={L(`mean over ${d.transfer.n} concepts`, `${d.transfer.n} kavram ortalaması`)} />
        <StatTile label={L("Research", "Araştırma")} value={d.research.projects} note={L(`${d.research.results} results · ${d.research.artifacts} artifacts`, `${d.research.results} sonuç · ${d.research.artifacts} eser`)} />
      </div>
    </section>
  );
}

export function RecordsAndInsights() {
  const db = useDB();
  const g = getGraph(db.knowledge);
  const len = db.events.length;
  const records = useMemo(() => personalRecords(db, g), [len, g]);
  const trends = useMemo(() => trendInsights(db, g), [len, g]);
  const prefs = useMemo(() => observedPreferences(db), [len]);
  const profile = useMemo(() => academicProfile(db, g).slice(0, 5), [len, g]);
  return (
    <>
      <section className="stack">
        <h2>{L("Personal records", "Kişisel rekorlar")}</h2>
        {records.length ? (
          <div className="grid-2">{records.map((r) => <StatTile key={r.id} label={r.label} value={r.value} note={`${r.detail}${r.at ? ` · ${fmtDate(r.at)}` : ""}`} />)}</div>
        ) : <p className="small muted">{L("Not enough data yet.", "Henüz yeterli veri yok.")}</p>}
      </section>
      <section className="stack">
        <h2>{L("Insights", "İçgörüler")}</h2>
        {!trends.length && !prefs.length && <p className="small muted">{L("Not enough data yet. Insights appear once a field has at least 12 answers or a comparison has 5 observations per side.", "Henüz yeterli veri yok. İçgörüler bir alanda en az 12 cevap ya da bir karşılaştırmanın her iki tarafında 5 gözlem olunca görünür.")}</p>}
        {trends.map((t, i) => <div key={i} className="card small">{t.text}<div className="tiny muted">{L(`n = ${t.n} · last 90 days`, `n = ${t.n} · son 90 gün`)}</div></div>)}
        {prefs.length > 0 && (
          <div className="card stack" style={{ gap: 6 }}>
            <strong className="small">{L("Observed learning patterns", "Gözlenen öğrenme örüntüleri")}</strong>
            {prefs.map((p, i) => <span key={i} className="small text-2">{p.text}</span>)}
            <span className="tiny muted">{L("Observations of behaviour, not a diagnosis. Only a Focus Lab experiment can say what causes what.", "Davranış gözlemi, teşhis değil. Neyin neye yol açtığını yalnızca bir Focus Lab deneyi söyleyebilir.")}</span>
          </div>
        )}
      </section>
      {profile.length > 0 && (
        <section className="stack">
          <h2>{L("Where you go deepest", "En çok derinleştiğin yerler")}</h2>
          <div className="card stack" style={{ gap: 6 }}>
            {profile.map((p) => (
              <div key={p.domain} className="stack" style={{ gap: 2 }}>
                <div className="row between small"><span>{p.label}</span><span className="tiny muted">{L(`${p.objects} concepts · ${p.deep} deep`, `${p.objects} kavram · ${p.deep} derin`)}</span></div>
                <Bar value={p.meanVerified} mastered={p.meanVerified >= 0.7} />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export function LanguagesAndCompetition() {
  const db = useDB();
  const g = getGraph(db.knowledge);
  const langs = useMemo(() => languageReports(db, g), [db.events.length, g]);
  const comp = useMemo(() => competitionReport(db, g), [db.events.length, g]);
  return (
    <>
      {langs.length > 0 && (
        <section className="stack">
          <h2>{L("Languages", "Diller")}</h2>
          {langs.map((r) => (
            <div key={r.domain} className="card stack" style={{ gap: 6 }}>
              <strong className="small">{r.label}</strong>
              {r.skills.map((s) => (
                <div key={s.skill} className="stack" style={{ gap: 2 }}>
                  <div className="row between tiny"><span>{SKILL_LABEL(s.skill)}</span><span className="muted">{s.meanVerified === null ? L(`no evidence · ${s.objects} topics`, `kanıt yok · ${s.objects} konu`) : L(`${pct(s.meanVerified)} · ${s.touched}/${s.objects} topics`, `${pct(s.meanVerified)} · ${s.objects} konunun ${s.touched} tanesi`)}</span></div>
                  <Bar value={s.meanVerified ?? 0} mastered={(s.meanVerified ?? 0) >= 0.7} />
                </div>
              ))}
            </div>
          ))}
        </section>
      )}
      {comp.attempts > 0 && (
        <section className="stack">
          <h2>{L("Competition practice", "Yarışma pratiği")}</h2>
          <p className="tiny muted">{L("Kept apart from mastery: speed and accuracy under competition conditions are a different skill.", "Ustalıktan ayrı tutulur: yarışma koşullarında hız ve doğruluk başka bir beceridir.")}</p>
          <div className="grid-3">
            <StatTile label={L("First-try accuracy", "İlk deneme doğruluğu")} value={pct(comp.accuracy)} needed={L("needs 5 attempts", "5 deneme gerekli")} note={L(`${comp.attempts} attempts`, `${comp.attempts} deneme`)} />
            <StatTile label={L("Median time", "Medyan süre")} value={comp.medianSeconds === null ? null : `${Math.round(comp.medianSeconds)} s`} needed={L("needs 5 timed answers", "5 süreli cevap gerekli")} />
            <StatTile label={L("Hardest solved", "Çözülen en zor")} value={comp.hardestSolved === null ? null : `${comp.hardestSolved}/5`} needed={L("nothing solved yet", "henüz çözülen yok")} />
            <StatTile label={L("Solution quality", "Çözüm kalitesi")} value={pct(comp.solutionQuality)} needed={L("needs 5 written solutions", "5 yazılı çözüm gerekli")} note={comp.topError ? L(`most common error: ${comp.topError}`, `en sık hata: ${comp.topError}`) : undefined} />
          </div>
        </section>
      )}
    </>
  );
}
