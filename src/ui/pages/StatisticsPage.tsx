import { useMemo, useState } from "react";
import { GROUP_LABEL, groupStats, overview, visitRows, type GroupKey } from "../../engines/statistics";
import { useDB } from "../state";
import { RateBars, RateTile, StatTile } from "../components/Stats";

const GROUPS: GroupKey[] = ["subject", "topic", "milestoneType", "interaction", "difficulty", "duration", "inputMethod", "stylus"];

const hm = (ms: number) => {
  const m = Math.round(ms / 60_000);
  return m >= 60 ? `${Math.floor(m / 60)} sa ${m % 60} dk` : `${m} dk`;
};

export function StatisticsPage() {
  const db = useDB();
  const len = db.events.length;
  const o = useMemo(() => overview(db), [db, len]);
  const rows = useMemo(() => visitRows(db), [db, len]);
  const [by, setBy] = useState<GroupKey>("milestoneType");
  const [metric, setMetric] = useState<"completion" | "persistence" | "continuation" | "firstTry">("completion");
  const groups = useMemo(() => groupStats(db, rows, by), [db, rows, by]);

  if (!o.sessions) {
    return (
      <div className="stack-lg rise">
        <h1>İstatistikler</h1>
        <div className="card"><p className="text-2">İstatistikler ilk çalışma oturumundan sonra görünür. Buradaki her şey ham olaylardan hesaplanır; veri olmadan hiçbir şey tahmin edilmez.</p></div>
      </div>
    );
  }

  return (
    <div className="stack-lg rise">
      <header className="stack" style={{ gap: 6 }}>
        <h1>İstatistikler</h1>
        <p className="small text-2">{db.events.length} ham olaydan hesaplandı. Yüzdeler sayıyı, örneklem büyüklüğünü ve olası aralığı gösterir; yeterli gözlem olmadan hiçbir şey gösterilmez.</p>
      </header>

      <section className="stack">
        <h2>İlerleme</h2>
        <div className="grid-2">
          <StatTile label="Etkin öğrenme süresi" value={hm(o.activeMs)} note={`${o.sessions} oturum · boşta ve arka planda geçen süre hariç`} />
          <StatTile label="Tamamlanan adımlar" value={o.milestonesCompleted} note={o.selfAttested ? `${o.selfAttested} tanesi kendi beyanın` : "hepsi kanıtlı"} />
          <StatTile label="Etkin saat başına adım" value={o.milestonesPerHour.value === null ? null : o.milestonesPerHour.value.toFixed(1).replace(".", ",")} needed="30 dk etkin süre gerekli" />
          <StatTile label="Ortalama adım süresi" value={o.avgMilestoneMinutes.value === null ? null : `${Math.round(o.avgMilestoneMinutes.value)} dk`} needed={`${o.avgMilestoneMinutes.n}/5 tamamlama`} note="açılıştan ustalığa etkin süre" />
          <RateTile label="Tamamlama oranı" r={o.completion} note="tamamlanan ve yarıda bırakılan ziyaretler" />
          <RateTile label="Yarıda bırakma oranı" r={o.abandonment} />
          <RateTile label="Yeniden deneme oranı" r={o.retry} note="yeniden deneme olan denemeler" />
          <RateTile label="Hatadan sonra sebat" r={o.persistence} note="hatadan sonra yeniden denedi" />
          <RateTile label="Devam etme oranı" r={o.continuation} note="bir adımı bitirince başka adım seçti" />
        </div>
      </section>

      <section className="stack">
        <h2>Bağlılık</h2>
        <div className="grid-2">
          <StatTile label="Bağlılık endeksi" value={o.engagement === null ? null : o.engagement.toFixed(2).replace(".", ",")} needed="tamamlama, sebat ya da devam verisi gerekli"
            note="tamamlama, sebat ve devam oranlarının ortalaması (0–1)" />
          <StatTile label="En uzun yüksek bağlılıklı oturum" value={o.longestHighEngagement ? hm(o.longestHighEngagement.activeMs) : null}
            needed="henüz uygun oturum yok" note={o.longestHighEngagement ? `${o.longestHighEngagement.completions} adım, sorulduğunda devam edildi` : undefined} />
        </div>
        <div className="card stack">
          <div className="row" style={{ gap: 6 }}>
            {GROUPS.map((g) => (
              <button key={g} className="btn small" aria-pressed={by === g} onClick={() => setBy(g)} style={by === g ? { borderColor: "var(--accent)", background: "var(--accent-soft)" } : undefined}>{GROUP_LABEL[g]}</button>
            ))}
          </div>
          <div className="tabs">
            {(["completion", "persistence", "continuation", "firstTry"] as const).map((m) => (
              <button key={m} className={metric === m ? "on" : ""} onClick={() => setMetric(m)}>{m === "firstTry" ? "İlk deneme" : { completion: "Tamamlama", persistence: "Sebat", continuation: "Devam" }[m]}</button>
            ))}
          </div>
          <RateBars rows={groups.map((g) => ({ label: g.group, r: g[metric] }))} empty="Bu gruplama için henüz kayıtlı ziyaret yok." />
          <p className="tiny muted">{GROUP_LABEL[by]} bazında bağlılık. Bir grupta 5 gözlem olunca çubuklar görünür; soluk bant olası aralıktır.</p>
        </div>
      </section>

      <section className="stack">
        <h2>Öğrenme</h2>
        <div className="banner warn small">Bağlılık öğrenmenin kanıtı değildir. Bu ölçüler bilerek ayrı tutulur: şimdiki doğruluk, ustalık, günler sonraki kalıcılık ve yeni durumlara transfer.</div>
        <div className="grid-2">
          <RateTile label="Anlık doğruluk" r={o.immediateAccuracy} note="ilk denemeler" />
          <StatTile label="Ustalık" value={o.mastery.mastered} note={`${o.mastery.evidenced} adımda cevap kanıtıyla ustalaşıldı`} />
          <RateTile label="Anında kontroller" r={o.immediateCheck} note="ustalıktan hemen sonra" />
          <RateTile label="Gecikmeli kalıcılık" r={o.delayedRetention} note="günler sonra" />
          <RateTile label="Transfer" r={o.transfer} note="yeni bağlam, aynı kavram" />
        </div>
      </section>
    </div>
  );
}
