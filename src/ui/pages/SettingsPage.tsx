import { useState } from "react";
import type { AIProviderId, HintLevel } from "../../domain/types";
import { HINT_LEVELS } from "../../domain/types";
import { act, store, toast, useAsync, useDB } from "../state";
import { makeProvider } from "../../ai/providers";
import { fullExport, importFull } from "../../data/exchange";
import { getGraph } from "../../knowledge/graph";
import { BackupsPanel, LearningPreferences, SystemHealth } from "../components/SettingsExtras";
import { recomputeAll } from "../../engines/progress";
import { auditDatabase } from "../../engines/integrity";
import { saveTextFile } from "../native";
import { HINT_TR } from "../../ai/tutor";
import { L, lazyLabels } from "../../i18n";
import { LanguageToggle } from "../components/LanguageToggle";
import { ReminderSettings } from "../components/TopicReview";

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
    toast(L("Keys saved on this device.", "Anahtarlar bu cihaza kaydedildi."));
  };

  const test = () => run(async () => {
    const provider = makeProvider(store.state.preferences);
    if (!provider.ready()) {
      toast(prefs.aiProvider === "local" ? L("Offline mode needs no test.", "Çevrimdışı mod test gerektirmez.") : L("Add a key first.", "Önce bir anahtar ekle."), "error");
      return;
    }
    const text = await provider.complete({ system: "Reply with JSON only.", prompt: 'Return {"ok": true}', json: true, maxTokens: 50 });
    toast(text.includes("ok") ? L(`${provider.id} responded.`, `${provider.id} yanıt verdi.`) : L(`Unexpected reply: ${text.slice(0, 80)}`, `Beklenmeyen yanıt: ${text.slice(0, 80)}`));
  });

  const exportData = () =>
    run(() => saveTextFile(`${L("lab-backup", "lab-yedek")}-${new Date().toISOString().slice(0, 10)}.json`, fullExport(store.state, { graphVersion: getGraph(store.state.knowledge).version }), "application/json"));

  const exportEvents = () => {
    const cols = ["at", "type", "sessionId", "subjectId", "courseId", "unitId", "topicId", "milestoneId", "questionId", "data"];
    const esc = (v: unknown) => {
      const t = v === undefined ? "" : typeof v === "string" ? v : JSON.stringify(v);
      return /[",\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
    };
    const rows = store.state.events.map((e) => cols.map((c) => esc(c === "at" ? new Date(e.at).toISOString() : (e as unknown as Record<string, unknown>)[c])).join(","));
    void run(() => saveTextFile(`${L("lab-events", "lab-olaylar")}-${new Date().toISOString().slice(0, 10)}.csv`, [cols.join(","), ...rows].join("\n"), "text/csv"));
  };

  const importData = async (file: File) => {
    try {
      let res;
      try {
        res = importFull(await file.text());
      } catch {
        throw new Error(L("This is not a Lab backup file.", "Bu bir Lab yedek dosyası değil."));
      }
      if (!confirm(L("Replace all current data with this backup? The current state is snapshotted first.", "Mevcut tüm veriler bu yedekle değiştirilsin mi? Mevcut durumun önce anlık görüntüsü alınır."))) return;
      await store.snapshotNow("before-import");
      const db2 = res.db;
      // API keys are not part of exports; keep the ones on this device.
      db2.preferences.apiKeys = { ...store.state.preferences.apiKeys, ...db2.preferences.apiKeys };
      recomputeAll(db2);
      store.replace(db2);
      toast(L("Backup restored.", "Yedek geri yüklendi."));
    } catch (e) {
      toast(e instanceof Error ? e.message : L("Could not read the file.", "Dosya okunamadı."), "error");
    }
  };

  return (
    <div className="stack-lg rise">
      <h1>{L("Settings", "Ayarlar")}</h1>

      <section className="card stack">
        <h2>Language / Dil</h2>
        <LanguageToggle />
        <p className="small text-2">{L("English is the main language. Switching also translates built-in course content you have not edited; your own notes and progress stay as they are.", "Ana dil İngilizcedir. Dil değiştirince düzenlemediğin hazır ders içerikleri de çevrilir; kendi notların ve ilerlemen olduğu gibi kalır.")}</p>
      </section>

      <section className="card stack">
        <h2>{L("Review reminders", "Tekrar hatırlatmaları")}</h2>
        <ReminderSettings db={db} />
      </section>

      <section className="card stack">
        <h2>{L("AI provider", "YZ sağlayıcısı")}</h2>
        <p className="small text-2">{L("Every AI feature works through one interface, so providers can be swapped at any time. If a call fails, Lab falls back to its offline behaviour.", "Her YZ özelliği tek bir arayüz üzerinden çalışır; sağlayıcı istediğin zaman değiştirilebilir. Bir çağrı başarısız olursa Lab çevrimdışı davranışına geçer.")}</p>
        <div className="tabs">
          {(["local", "gemini", "groq"] as AIProviderId[]).map((p) => (
            <button key={p} className={prefs.aiProvider === p ? "on" : ""} onClick={() => setProvider(p)}>{p === "local" ? L("Offline", "Çevrimdışı") : p === "gemini" ? "Gemini" : "Groq"}</button>
          ))}
        </div>
        <div className="field"><label htmlFor="gk">{L("Gemini API key", "Gemini API anahtarı")}</label><input id="gk" className="input mono" type="password" autoComplete="off" value={keys.gemini} onChange={(e) => setKeys({ ...keys, gemini: e.target.value })} /></div>
        <div className="field"><label htmlFor="gm">Gemini model</label><input id="gm" className="input mono" value={prefs.models.gemini} onChange={(e) => act((d) => void (d.preferences.models.gemini = e.target.value))} /></div>
        <div className="field"><label htmlFor="qk">{L("Groq API key", "Groq API anahtarı")}</label><input id="qk" className="input mono" type="password" autoComplete="off" value={keys.groq} onChange={(e) => setKeys({ ...keys, groq: e.target.value })} /></div>
        <div className="field"><label htmlFor="qm">Groq model</label><input id="qm" className="input mono" value={prefs.models.groq} onChange={(e) => act((d) => void (d.preferences.models.groq = e.target.value))} /></div>
        <div className="row">
          <button className="btn primary" onClick={saveKeys}>{L("Save keys", "Anahtarları kaydet")}</button>
          <button className="btn" onClick={test} disabled={busy}>{busy ? <span className="spinner" /> : L("Test connection", "Bağlantıyı test et")}</button>
        </div>
        <p className="tiny muted">{L("Keys are stored only on this device and sent only to the provider you choose.", "Anahtarlar yalnızca bu cihazda saklanır ve yalnızca seçtiğin sağlayıcıya gönderilir.")}</p>
      </section>

      <AILog />

      <section className="card stack">
        <h2>{L("Help and productive struggle", "Yardım ve verimli zorlanma")}</h2>
        <div className="field">
          <label htmlFor="cap">{L("Highest help level offered before you explicitly ask for more", "Sen açıkça istemeden önce sunulan en yüksek yardım düzeyi")}</label>
          <select id="cap" className="select" value={prefs.hintCap} onChange={(e) => act((d) => void (d.preferences.hintCap = Number(e.target.value) as HintLevel))}>
            {HINT_LEVELS.slice(1).map((l, i) => <option key={l} value={i + 1}>{i + 1}. {HINT_TR[i + 1]}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="ret">{L("Days before the first delayed retention check", "İlk gecikmeli kalıcılık kontrolüne kadar gün")}</label>
          <input id="ret" className="input" type="number" min={1} max={30} value={prefs.retentionDelayDays} onChange={(e) => act((d) => void (d.preferences.retentionDelayDays = Math.max(1, Math.min(30, Number(e.target.value) || 3))))} />
        </div>
        <label className="row nowrap"><input type="checkbox" checked={prefs.experimentsEnabled} onChange={(e) => act((d) => void (d.preferences.experimentsEnabled = e.target.checked))} style={{ width: 20, height: 20 }} /> {L("Allow personal experiments to vary session conditions", "Kişisel deneylerin oturum koşullarını değiştirmesine izin ver")}</label>
      </section>

      <LearningPreferences />

      <section className="card stack">
        <h2>{L("Your data", "Verilerin")}</h2>
        <p className="small text-2">{L("Everything lives on this device. The backup is a versioned, documented JSON export of your whole academic state (curriculum, mastery, attempts, errors, paths, goals, projects, research, sources, experiments, journal, raw events) — readable without Lab. API keys are never included.", "Her şey bu cihazda durur. Yedek, tüm akademik durumunun (müfredat, ustalık, denemeler, hatalar, rotalar, hedefler, projeler, araştırmalar, kaynaklar, deneyler, günlük, ham olaylar) sürümlü ve belgelenmiş bir JSON dışa aktarımıdır — Lab olmadan da okunabilir. API anahtarları asla dahil edilmez.")}</p>
        <div className="small muted">{L(`${Object.keys(db.milestones).length} milestones · ${Object.keys(db.attempts).length} attempts · ${db.events.length} raw events · stored in ${store.backend}`, `${Object.keys(db.milestones).length} adım · ${Object.keys(db.attempts).length} deneme · ${db.events.length} ham olay · depolama: ${store.backend}`)}</div>
        {store.lastSaveError && <div className="banner error">{L(`Last save failed: ${store.lastSaveError}. Export a backup now.`, `Son kayıt başarısız: ${store.lastSaveError}. Hemen bir yedek al.`)}</div>}
        <div className="row">
          <button className="btn" onClick={exportData}>{L("Export backup", "Yedeği dışa aktar")}</button>
          <button className="btn" onClick={exportEvents}>{L("Export raw events (CSV)", "Ham olayları dışa aktar (CSV)")}</button>
          <button className="btn" onClick={() => {
            const issues = auditDatabase(store.state);
            toast(issues.length ? L(`${issues.length} issue(s): ${issues.slice(0, 2).join("; ")}`, `${issues.length} sorun: ${issues.slice(0, 2).join("; ")}`) : L("Integrity check passed: no loops, dead ends or impossible states.", "Bütünlük kontrolü geçti: döngü, çıkmaz ya da imkânsız durum yok."), issues.length ? "error" : "info");
          }}>{L("Check integrity", "Bütünlüğü kontrol et")}</button>
          <label className="btn" style={{ cursor: "pointer" }}>{L("Restore backup", "Yedeği geri yükle")}<input type="file" accept="application/json,.json" hidden onChange={(e) => e.target.files?.[0] && importData(e.target.files[0])} /></label>
        </div>
      </section>
      <BackupsPanel />
      <SystemHealth />
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
      <h2>{L("AI activity", "YZ etkinliği")}</h2>
      <p className="small text-2">{L(`${list.length} AI requests · ${failed} fell back to offline behaviour. Roles share one provider interface.`, `${list.length} YZ isteği · ${failed} tanesi çevrimdışı davranışa geçti. Tüm roller tek sağlayıcı arayüzünü paylaşır.`)}</p>
      <div className="list">
        {list.slice(0, 8).map((x) => (
          <div key={x.id} className="list-item small">
            <span className="chip">{ROLE_TR[x.role] ?? x.role}</span>
            <span className="grow truncate">{x.summary}</span>
            <span className={x.ok ? "muted" : ""} style={x.ok ? undefined : { color: "var(--review)" }}>{x.ok ? `${x.provider} · ${(x.latencyMs / 1000).toFixed(1)}s` : `${L("fallback", "çevrimdışına geçti")}${x.error ? ` (${x.error.slice(0, 40)})` : ""}`}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

const ROLE_TR: Record<string, string> = lazyLabels<string>({
  TUTOR: "tutor", SOCRATIC_GUIDE: "socratic guide", EVALUATOR: "evaluator", HINT_GENERATOR: "hint generator",
  MILESTONE_GENERATOR: "milestone generator", CURRICULUM_BUILDER: "curriculum builder", DIFFICULTY_CALIBRATOR: "difficulty calibrator",
  REFLECTION_ANALYST: "reflection analyst", CURRICULUM_ADVISOR: "curriculum advisor", FEEDBACK_GENERATOR: "feedback generator",
  QA_ASSISTANT: "question answering", EXPLANATION_EVALUATOR: "explanation evaluator", FLASHCARD_GENERATOR: "flashcard generator", MINDMAP_GENERATOR: "mind-map generator",
}, {
  TUTOR: "öğretmen", SOCRATIC_GUIDE: "sokratik rehber", EVALUATOR: "değerlendirici", HINT_GENERATOR: "ipucu üretici",
  MILESTONE_GENERATOR: "adım üretici", CURRICULUM_BUILDER: "müfredat kurucu", DIFFICULTY_CALIBRATOR: "zorluk ayarlayıcı",
  REFLECTION_ANALYST: "değerlendirme analisti", CURRICULUM_ADVISOR: "müfredat danışmanı", FEEDBACK_GENERATOR: "geri bildirim üretici",
  QA_ASSISTANT: "soru yanıtlama", EXPLANATION_EVALUATOR: "anlatım değerlendirici", FLASHCARD_GENERATOR: "kart üretici", MINDMAP_GENERATOR: "zihin haritası üretici",
});
