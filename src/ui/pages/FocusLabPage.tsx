import { useMemo, useState } from "react";
import { FOCUS_FACTORS, MIN_GROUP_N, OUTCOME_LABEL, focusReport, type Outcome } from "../../engines/focusLab";
import { GROUP_LABEL } from "../../engines/statistics";
import { useDB } from "../state";
import { RateBars } from "../components/Stats";
import { ExperimentsSection } from "./ExperimentsSection";

export function FocusLabPage() {
  const db = useDB();
  const len = db.events.length;
  const report = useMemo(() => focusReport(db), [db, len]);
  const [outcome, setOutcome] = useState<Outcome>("continuation");

  return (
    <div className="stack-lg rise">
      <header className="stack" style={{ gap: 6 }}>
        <span className="eyebrow">Odak Laboratuvarı</span>
        <h1>Sana ne yardımcı oluyor gibi?</h1>
        <p className="small text-2">Kendi verindeki örüntüler — adım uzunluğu, zorluk, kalem kullanımı, geri bildirim, yenilik, günün saati, yardım düzeyi. Bunlar gözleme dayalıdır: neyin neye neden olduğunu değil, nelerin birlikte görüldüğünü gösterir. Bir grup karşılaştırılmadan önce {MIN_GROUP_N} gözlem gerekir.</p>
      </header>

      <section className="card stack">
        <h2>Tasarım hipotezin</h2>
        <p className="small text-2">"Büyük bir hedef sürekli olarak aktif çalışma, anında geri bildirim, görünür ilerleme ve net bir sonraki adım içeren küçük ve somut adımlara dönüştüğünde güçlü biçimde bağlanabilirim." Lab bunu verili kabul etmez, test edilecek bir şey olarak ele alır.</p>
        {report.hypothesis.map((h) => (
          <div key={h.label} className="list-item small" style={{ alignItems: "flex-start" }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, marginTop: 7, flex: "none", background: h.pattern ? "var(--accent)" : "var(--border-strong)" }} />
            <span className="grow"><strong>{h.label}</strong><br />
              <span className="text-2">{h.pattern ? h.pattern.sentence : h.status.status === "insufficient" ? `Henüz yeterli kanıt yok — karşılaştırılan her grubun ${MIN_GROUP_N} gözleme ihtiyacı var.` : "Şimdilik belirgin bir fark yok."}</span>
            </span>
          </div>
        ))}
        <p className="tiny muted">Daha adil bir test için aşağıda kişisel bir deney başlat — koşulları sırayla değiştirir, böylece farkı başka etkenlerin açıklama olasılığı azalır.</p>
      </section>

      <section className="stack">
        <h2>Bulunan örüntüler</h2>
        {report.patterns.length ? (
          report.patterns.slice(0, 6).map((p, i) => (
            <div key={i} className={`banner ${p.strength === "associated" ? "info" : ""} small`}>
              {p.sentence} <span className="muted">{p.strength === "associated" ? "Gözleme dayalı, nedensel değil." : "Zayıf kanıt — daha çok veriyle kaybolabilir."}</span>
            </div>
          ))
        ) : (
          <div className="card small text-2">{report.visits < 2 * MIN_GROUP_N ? `Yetersiz veri: ${report.visits} adım ziyareti kaydedildi. Örüntüler için en az ${MIN_GROUP_N} gözlemli iki grup gerekir.` : "Henüz belirgin örüntü yok. Bu da geçerli bir sonuç: şimdiye kadarki farklar küçük ya da gürültü düzeyinde."}</div>
        )}
      </section>

      <section className="card stack">
        <h2>Bir etkeni incele</h2>
        <div className="tabs">
          {(["continuation", "completion", "persistence", "firstTry"] as Outcome[]).map((o) => (
            <button key={o} className={outcome === o ? "on" : ""} onClick={() => setOutcome(o)}>{o === "firstTry" ? "İlk deneme" : { continuation: "Devam", completion: "Tamamlama", persistence: "Sebat" }[o]}</button>
          ))}
        </div>
        <p className="tiny muted">Sonuç ölçütü: {OUTCOME_LABEL[outcome]}.</p>
        {FOCUS_FACTORS.map((f) => {
          const st = report.statuses.find((s) => s.factor === f && s.outcome === outcome)!;
          return (
            <div key={f} className="stack" style={{ gap: 6, paddingTop: 8, borderTop: "1px solid var(--border)" }}>
              <div className="row between small"><strong>{GROUP_LABEL[f]}</strong>
                <span className="muted">{st.status === "pattern" ? "örüntü" : st.status === "insufficient" ? "yetersiz veri" : "belirgin fark yok"}</span></div>
              <RateBars rows={st.groups.map((g) => ({ label: g.group, r: g.rate }))} empty="Henüz gözlem yok." />
            </div>
          );
        })}
      </section>

      <ExperimentsSection />
    </div>
  );
}
