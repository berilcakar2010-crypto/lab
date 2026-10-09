import { useMemo, useState } from "react";
import { GROUP_LABEL, groupStats, overview, visitRows, type GroupKey } from "../../engines/statistics";
import { navigate, useDB } from "../state";
import { L, fmtNum, lower, pick } from "../../i18n";
import { Icon } from "../components/common";
import { LearningLayers } from "../components/Adaptive";
import { RateBars, RateTile, StatTile } from "../components/Stats";
import { DepthOfKnowledge, LanguagesAndCompetition, RecordsAndInsights } from "../components/StatsExtras";

const GROUPS: GroupKey[] = ["subject", "topic", "milestoneType", "interaction", "difficulty", "duration", "inputMethod", "stylus"];

const hm = (ms: number) => {
  const m = Math.round(ms / 60_000);
  return m >= 60 ? L(`${Math.floor(m / 60)}h ${m % 60}m`, `${Math.floor(m / 60)} sa ${m % 60} dk`) : L(`${m} min`, `${m} dk`);
};

export function StatisticsPage() {
  const db = useDB();
  const len = db.events.length;
  const o = useMemo(() => overview(db), [db, len]);
  const rows = useMemo(() => visitRows(db), [db, len]);
  const [by, setBy] = useState<GroupKey>("milestoneType");
  const [metric, setMetric] = useState<"completion" | "persistence" | "continuation" | "firstTry">("completion");
  const groups = useMemo(() => groupStats(db, rows, by), [db, rows, by]);

  const focusLab = (
    <button className="btn small" onClick={() => navigate("/focus")}><Icon.flask /> {L("Focus Lab", "Odak Lab")}</button>
  );

  if (!o.sessions) {
    return (
      <div className="stack-lg rise">
        <div className="row between">
          <h1>{L("Statistics", "İstatistikler")}</h1>
          {focusLab}
        </div>
        <div className="card"><p className="text-2">{L("Statistics appear after your first learning session. Everything here is computed from raw events, so nothing is estimated before there is data.", "İstatistikler ilk çalışma oturumundan sonra görünür. Buradaki her şey ham olaylardan hesaplanır; veri olmadan hiçbir şey tahmin edilmez.")}</p></div>
      </div>
    );
  }

  return (
    <div className="stack-lg rise">
      <header className="stack" style={{ gap: 6 }}>
        <div className="row between">
          <h1>{L("Statistics", "İstatistikler")}</h1>
          {focusLab}
        </div>
        <p className="small text-2">{L(`Computed from ${db.events.length} raw events. Percentages show the count, sample size and a likely range; nothing is shown until there are enough observations.`, `${db.events.length} ham olaydan hesaplandı. Yüzdeler sayıyı, örneklem büyüklüğünü ve olası aralığı gösterir; yeterli gözlem olmadan hiçbir şey gösterilmez.`)}</p>
      </header>

      <DepthOfKnowledge />
      <LearningLayers />

      <section className="stack">
        <h2>{L("Progress", "İlerleme")}</h2>
        <div className="grid-2">
          <StatTile label={L("Active learning time", "Etkin öğrenme süresi")} value={hm(o.activeMs)} note={L(`${o.sessions} session${o.sessions === 1 ? "" : "s"} · idle and hidden time excluded`, `${o.sessions} oturum · boşta ve arka planda geçen süre hariç`)} />
          <StatTile label={L("Milestones completed", "Tamamlanan adımlar")} value={o.milestonesCompleted} note={o.selfAttested ? L(`${o.selfAttested} self-attested`, `${o.selfAttested} tanesi kendi beyanın`) : L("all with evidence", "hepsi kanıtlı")} />
          <StatTile label={L("Milestones per active hour", "Etkin saat başına adım")} value={o.milestonesPerHour.value === null ? null : fmtNum(Number(o.milestonesPerHour.value.toFixed(1)))} needed={L("needs 30 min of active time", "30 dk etkin süre gerekli")} />
          <StatTile label={L("Average milestone duration", "Ortalama adım süresi")} value={o.avgMilestoneMinutes.value === null ? null : L(`${Math.round(o.avgMilestoneMinutes.value)} min`, `${Math.round(o.avgMilestoneMinutes.value)} dk`)} needed={L(`${o.avgMilestoneMinutes.n} of 5 completions`, `${o.avgMilestoneMinutes.n}/5 tamamlama`)} note={L("active time, from open to mastery", "açılıştan ustalığa etkin süre")} />
          <RateTile label={L("Completion rate", "Tamamlama oranı")} r={o.completion} note={L("completed vs. abandoned visits", "tamamlanan ve yarıda bırakılan ziyaretler")} />
          <RateTile label={L("Abandonment rate", "Yarıda bırakma oranı")} r={o.abandonment} />
          <RateTile label={L("Retry rate", "Yeniden deneme oranı")} r={o.retry} note={L("attempts that were retries", "yeniden deneme olan denemeler")} />
          <RateTile label={L("Persistence after failure", "Hatadan sonra sebat")} r={o.persistence} note={L("tried again after a mistake", "hatadan sonra yeniden denedi")} />
          <RateTile label={L("Continuation rate", "Devam etme oranı")} r={o.continuation} note={L("chose another milestone after finishing one", "bir adımı bitirince başka adım seçti")} />
        </div>
      </section>

      <section className="stack">
        <h2>{L("Engagement", "Bağlılık")}</h2>
        <div className="grid-2">
          <StatTile label={L("Engagement index", "Bağlılık endeksi")} value={o.engagement === null ? null : fmtNum(Number(o.engagement.toFixed(2)), 2)} needed={L("needs completion, persistence or continuation data", "tamamlama, sebat ya da devam verisi gerekli")}
            note={L("mean of completion, persistence and continuation rates (0–1)", "tamamlama, sebat ve devam oranlarının ortalaması (0–1)")} />
          <StatTile label={L("Longest high-engagement session", "En uzun yüksek bağlılıklı oturum")} value={o.longestHighEngagement ? hm(o.longestHighEngagement.activeMs) : null}
            needed={L("no qualifying session yet", "henüz uygun oturum yok")} note={o.longestHighEngagement ? L(`${o.longestHighEngagement.completions} milestones, continued when asked`, `${o.longestHighEngagement.completions} adım, sorulduğunda devam edildi`) : undefined} />
        </div>
        <div className="card stack">
          <div className="row" style={{ gap: 6 }}>
            {GROUPS.map((g) => (
              <button key={g} className="btn small" aria-pressed={by === g} onClick={() => setBy(g)} style={by === g ? { borderColor: "var(--accent)", background: "var(--accent-soft)" } : undefined}>{GROUP_LABEL[g]}</button>
            ))}
          </div>
          <div className="tabs">
            {(["completion", "persistence", "continuation", "firstTry"] as const).map((m) => (
              <button key={m} className={metric === m ? "on" : ""} onClick={() => setMetric(m)}>{m === "firstTry" ? L("First try", "İlk deneme") : pick({ completion: "Completion", persistence: "Persistence", continuation: "Continuation" }, { completion: "Tamamlama", persistence: "Sebat", continuation: "Devam" })[m]}</button>
            ))}
          </div>
          <RateBars rows={groups.map((g) => ({ label: g.group, r: g[metric] }))} empty={L("No visits recorded for this grouping yet.", "Bu gruplama için henüz kayıtlı ziyaret yok.")} />
          <p className="tiny muted">{L(`Engagement by ${lower(GROUP_LABEL[by])}. Bars appear once a group has 5 observations; the pale band is the likely range.`, `${GROUP_LABEL[by]} bazında bağlılık. Bir grupta 5 gözlem olunca çubuklar görünür; soluk bant olası aralıktır.`)}</p>
        </div>
      </section>

      <section className="stack">
        <h2>{L("Learning", "Öğrenme")}</h2>
        <div className="banner warn small">{L("Engagement is not evidence of learning. These measures are kept separate on purpose: accuracy right now, mastery, retention days later, and transfer to new situations.", "Bağlılık öğrenmenin kanıtı değildir. Bu ölçüler bilerek ayrı tutulur: şimdiki doğruluk, ustalık, günler sonraki kalıcılık ve yeni durumlara transfer.")}</div>
        <div className="grid-2">
          <RateTile label={L("Immediate accuracy", "Anlık doğruluk")} r={o.immediateAccuracy} note={L("first attempts", "ilk denemeler")} />
          <StatTile label={L("Mastery", "Ustalık")} value={o.mastery.mastered} note={L(`${o.mastery.evidenced} milestones mastered with answer evidence`, `${o.mastery.evidenced} adımda cevap kanıtıyla ustalaşıldı`)} />
          <RateTile label={L("Immediate checks", "Anında kontroller")} r={o.immediateCheck} note={L("right after mastery", "ustalıktan hemen sonra")} />
          <RateTile label={L("Delayed retention", "Gecikmeli kalıcılık")} r={o.delayedRetention} note={L("days later", "günler sonra")} />
          <RateTile label="Transfer" r={o.transfer} note={L("new context, same concept", "yeni bağlam, aynı kavram")} />
        </div>
      </section>

      <RecordsAndInsights />
      <LanguagesAndCompetition />
    </div>
  );
}
