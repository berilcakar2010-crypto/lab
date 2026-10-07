import { useState } from "react";
import type { AIProviderId, HintLevel } from "../../domain/types";
import { HINT_LEVELS } from "../../domain/types";
import { act, store, toast, useAsync, useDB } from "../state";
import { makeProvider } from "../../ai/providers";
import { hydrateDB } from "../../data/db";
import { recomputeAll } from "../../engines/progress";
import { auditDatabase } from "../../engines/integrity";
import { saveTextFile } from "../native";
import { HINT_TR } from "../../ai/tutor";

export function SettingsPage() {
  const db = useDB();
  const prefs = db.preferences;
  const [keys, setKeys] = useState({ gemini: prefs.apiKeys.gemini ?? "", groq: prefs.apiKeys.groq ?? "" });
  const { busy, run } = useAsync();

  const setProvider = (p: AIProviderId) => act((d) => void (d.preferences.aiProvider = p));
  const saveKeys = () => {
    act((d) => {
      d.preferences.apiKeys = { gemini: keys.gemini.trim() || undefined, groq: keys.groq.trim() || undefined };
    });
    toast("Anahtarlar bu cihaza kaydedildi.");
  };

  const test = () => run(async () => {
    const provider = makeProvider(store.state.preferences);
    if (!provider.ready()) {
      toast(prefs.aiProvider === "local" ? "Çevrimdışı mod test gerektirmez." : "Önce bir anahtar ekle.", "error");
      return;
    }
    const text = await provider.complete({ system: "Reply with JSON only.", prompt: 'Return {"ok": true}', json: true, maxTokens: 50 });
    toast(text.includes("ok") ? `${provider.id} yanıt verdi.` : `Beklenmeyen yanıt: ${text.slice(0, 80)}`);
  });

  const exportData = () =>
    run(() => saveTextFile(`lab-yedek-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(store.state), "application/json"));

  const exportEvents = () => {
    const cols = ["at", "type", "sessionId", "subjectId", "courseId", "unitId", "topicId", "milestoneId", "questionId", "data"];
    const esc = (v: unknown) => {
      const t = v === undefined ? "" : typeof v === "string" ? v : JSON.stringify(v);
      return /[",\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
    };
    const rows = store.state.events.map((e) => cols.map((c) => esc(c === "at" ? new Date(e.at).toISOString() : (e as unknown as Record<string, unknown>)[c])).join(","));
    void run(() => saveTextFile(`lab-olaylar-${new Date().toISOString().slice(0, 10)}.csv`, [cols.join(","), ...rows].join("\n"), "text/csv"));
  };

  const importData = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text());
      if (!parsed || typeof parsed !== "object" || !("milestones" in parsed)) throw new Error("Bu bir Lab yedek dosyası değil.");
      if (!confirm("Mevcut tüm veriler bu yedekle değiştirilsin mi? Emin değilsen önce dışa aktar.")) return;
      const db2 = hydrateDB(parsed);
      recomputeAll(db2);
      store.replace(db2);
      toast("Yedek geri yüklendi.");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Dosya okunamadı.", "error");
    }
  };

  return (
    <div className="stack-lg rise">
      <h1>Ayarlar</h1>

      <section className="card stack">
        <h2>YZ sağlayıcısı</h2>
        <p className="small text-2">Her YZ özelliği tek bir arayüz üzerinden çalışır; sağlayıcı istediğin zaman değiştirilebilir. Bir çağrı başarısız olursa Lab çevrimdışı davranışına geçer.</p>
        <div className="tabs">
          {(["local", "gemini", "groq"] as AIProviderId[]).map((p) => (
            <button key={p} className={prefs.aiProvider === p ? "on" : ""} onClick={() => setProvider(p)}>{p === "local" ? "Çevrimdışı" : p === "gemini" ? "Gemini" : "Groq"}</button>
          ))}
        </div>
        <div className="field"><label htmlFor="gk">Gemini API anahtarı</label><input id="gk" className="input mono" type="password" autoComplete="off" value={keys.gemini} onChange={(e) => setKeys({ ...keys, gemini: e.target.value })} /></div>
        <div className="field"><label htmlFor="gm">Gemini model</label><input id="gm" className="input mono" value={prefs.models.gemini} onChange={(e) => act((d) => void (d.preferences.models.gemini = e.target.value))} /></div>
        <div className="field"><label htmlFor="qk">Groq API anahtarı</label><input id="qk" className="input mono" type="password" autoComplete="off" value={keys.groq} onChange={(e) => setKeys({ ...keys, groq: e.target.value })} /></div>
        <div className="field"><label htmlFor="qm">Groq model</label><input id="qm" className="input mono" value={prefs.models.groq} onChange={(e) => act((d) => void (d.preferences.models.groq = e.target.value))} /></div>
        <div className="row">
          <button className="btn primary" onClick={saveKeys}>Anahtarları kaydet</button>
          <button className="btn" onClick={test} disabled={busy}>{busy ? <span className="spinner" /> : "Bağlantıyı test et"}</button>
        </div>
        <p className="tiny muted">Anahtarlar yalnızca bu cihazda saklanır ve yalnızca seçtiğin sağlayıcıya gönderilir.</p>
      </section>

      <AILog />

      <section className="card stack">
        <h2>Yardım ve verimli zorlanma</h2>
        <div className="field">
          <label htmlFor="cap">Sen açıkça istemeden önce sunulan en yüksek yardım düzeyi</label>
          <select id="cap" className="select" value={prefs.hintCap} onChange={(e) => act((d) => void (d.preferences.hintCap = Number(e.target.value) as HintLevel))}>
            {HINT_LEVELS.slice(1).map((l, i) => <option key={l} value={i + 1}>{i + 1}. {HINT_TR[i + 1]}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="ret">İlk gecikmeli kalıcılık kontrolüne kadar gün</label>
          <input id="ret" className="input" type="number" min={1} max={30} value={prefs.retentionDelayDays} onChange={(e) => act((d) => void (d.preferences.retentionDelayDays = Math.max(1, Math.min(30, Number(e.target.value) || 3))))} />
        </div>
        <label className="row nowrap"><input type="checkbox" checked={prefs.reduceMotion} onChange={(e) => act((d) => void (d.preferences.reduceMotion = e.target.checked))} style={{ width: 20, height: 20 }} /> Hareketi azalt</label>
        <label className="row nowrap"><input type="checkbox" checked={prefs.experimentsEnabled} onChange={(e) => act((d) => void (d.preferences.experimentsEnabled = e.target.checked))} style={{ width: 20, height: 20 }} /> Kişisel deneylerin oturum koşullarını değiştirmesine izin ver</label>
      </section>

      <section className="card stack">
        <h2>Verilerin</h2>
        <p className="small text-2">Her şey bu cihazda durur. Düzenli yedek al; istatistikler yeniden hesaplanabilsin diye ham olaylar da yedeğe dahildir.</p>
        <div className="small muted">{Object.keys(db.milestones).length} adım · {Object.keys(db.attempts).length} deneme · {db.events.length} ham olay · depolama: {store.backend}</div>
        {store.lastSaveError && <div className="banner error">Son kayıt başarısız: {store.lastSaveError}. Hemen bir yedek al.</div>}
        <div className="row">
          <button className="btn" onClick={exportData}>Yedeği dışa aktar</button>
          <button className="btn" onClick={exportEvents}>Ham olayları dışa aktar (CSV)</button>
          <button className="btn" onClick={() => {
            const issues = auditDatabase(store.state);
            toast(issues.length ? `${issues.length} sorun: ${issues.slice(0, 2).join("; ")}` : "Bütünlük kontrolü geçti: döngü, çıkmaz ya da imkânsız durum yok.", issues.length ? "error" : "info");
          }}>Bütünlüğü kontrol et</button>
          <label className="btn" style={{ cursor: "pointer" }}>Yedeği geri yükle<input type="file" accept="application/json,.json" hidden onChange={(e) => e.target.files?.[0] && importData(e.target.files[0])} /></label>
        </div>
      </section>
    </div>
  );
}

function AILog() {
  const db = useDB();
  const list = Object.values(db.aiInteractions).sort((a, b) => b.createdAt - a.createdAt);
  if (!list.length) return null;
  const failed = list.filter((x) => !x.ok).length;
  return (
    <section className="card stack">
      <h2>YZ etkinliği</h2>
      <p className="small text-2">{list.length} YZ isteği · {failed} tanesi çevrimdışı davranışa geçti. Tüm roller tek sağlayıcı arayüzünü paylaşır.</p>
      <div className="list">
        {list.slice(0, 8).map((x) => (
          <div key={x.id} className="list-item small">
            <span className="chip">{ROLE_TR[x.role] ?? x.role}</span>
            <span className="grow truncate">{x.summary}</span>
            <span className={x.ok ? "muted" : ""} style={x.ok ? undefined : { color: "var(--review)" }}>{x.ok ? `${x.provider} · ${(x.latencyMs / 1000).toFixed(1)}s` : `çevrimdışına geçti${x.error ? ` (${x.error.slice(0, 40)})` : ""}`}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

const ROLE_TR: Record<string, string> = {
  TUTOR: "öğretmen", SOCRATIC_GUIDE: "sokratik rehber", EVALUATOR: "değerlendirici", HINT_GENERATOR: "ipucu üretici",
  MILESTONE_GENERATOR: "adım üretici", CURRICULUM_BUILDER: "müfredat kurucu", DIFFICULTY_CALIBRATOR: "zorluk ayarlayıcı",
  REFLECTION_ANALYST: "değerlendirme analisti", CURRICULUM_ADVISOR: "müfredat danışmanı", FEEDBACK_GENERATOR: "geri bildirim üretici",
};
