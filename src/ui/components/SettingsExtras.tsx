/**
 * Settings added with the academic layer: how Lab challenges you and how the
 * AI talks to you, motion, privacy, retention strategies, automatic local
 * backups, and a (collapsed) system-health view for maintenance.
 */
import { useEffect, useState } from "react";
import { CHALLENGE_LEVELS, AI_STYLE_KEYS, type AIStyleKey, type AnimationLevel } from "../../domain/academic";
import { L, fmtDate } from "../../i18n";
import { getGraph } from "../../knowledge/graph";
import { RETENTION_STRATEGIES, type RetentionStrategyId } from "../../adaptive/retentionStrategy";
import { healthReport, maintenanceSuggestions } from "../../engines/health";
import { aiCacheSize, clearAICache } from "../../ai/engine";
import type { SnapshotInfo } from "../../data/store";
import { act, navigate, store, toast, useDB } from "../state";
import { LEVEL_LABEL } from "./OpenLab";

const STYLE_LABEL = (k: AIStyleKey) => ({ socratic: L("More Socratic", "Daha sokratik"), concise: L("More concise", "Daha kısa"), rigorous: L("More rigorous", "Daha titiz"), explanatory: L("More explanatory", "Daha açıklayıcı"), challenging: L("More challenging", "Daha zorlayıcı") })[k];

export function LearningPreferences() {
  const db = useDB();
  const p = db.preferences;
  const check = (label: string, on: boolean, set: (v: boolean) => void) => (
    <label className="row nowrap"><input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} style={{ width: 20, height: 20 }} /> {label}</label>
  );
  return (
    <section className="card stack">
      <h2>{L("How Lab works with you", "Lab seninle nasıl çalışır")}</h2>
      <div className="field">
        <label>{L("Challenge level (cognitive difficulty only)", "Zorluk seviyesi (yalnızca bilişsel zorluk)")}</label>
        <div className="seg" role="radiogroup">
          {CHALLENGE_LEVELS.map((l) => <button key={l} role="radio" aria-checked={p.challengeLevel === l} className={p.challengeLevel === l ? "on" : ""} onClick={() => act((d) => { d.preferences.challengeLevel = l; })}>{LEVEL_LABEL(l)}</button>)}
        </div>
      </div>
      <div className="field">
        <label>{L("How the AI should respond", "YZ nasıl yanıt versin")}</label>
        <div className="row" style={{ gap: 6 }}>
          {AI_STYLE_KEYS.map((k) => <button key={k} className={`btn small ${p.aiStyle[k] ? "primary" : ""}`} aria-pressed={p.aiStyle[k]} onClick={() => act((d) => { d.preferences.aiStyle = { ...d.preferences.aiStyle, [k]: !d.preferences.aiStyle[k] }; })}>{STYLE_LABEL(k)}</button>)}
        </div>
        <span className="tiny muted">{L("Preferences about style only — never personality types. The AI still guides before it answers.", "Yalnızca üslup tercihleri — asla kişilik tipleri değil. YZ yine de cevaplamadan önce yol gösterir.")}</span>
      </div>
      {check(L("Suggest one thing to do when I open Lab", "Lab'ı açtığımda yapılacak tek bir şey öner"), p.dailySuggestions, (v) => act((d) => { d.preferences.dailySuggestions = v; }))}
      {check(L("Deep work in sessions (minimal screen)", "Oturumlarda derin çalışma (sade ekran)"), p.deepWork, (v) => act((d) => { d.preferences.deepWork = v; }))}
      {check(L("Send the AI only what each request needs (recommended)", "YZ'ye yalnızca her isteğin ihtiyacı olanı gönder (önerilir)"), p.minimalAIContext, (v) => act((d) => { d.preferences.minimalAIContext = v; }))}
      <div className="field">
        <label htmlFor="anim">{L("Animation", "Animasyon")}</label>
        <select id="anim" className="select" value={p.animation} onChange={(e) => act((d) => { d.preferences.animation = e.target.value as AnimationLevel; d.preferences.reduceMotion = e.target.value !== "full"; })}>
          <option value="full">{L("Full (purposeful only)", "Tam (yalnızca anlamlı olanlar)")}</option>
          <option value="reduced">{L("Reduced", "Azaltılmış")}</option>
          <option value="off">{L("Off", "Kapalı")}</option>
        </select>
      </div>
      <div className="grid-2">
        {(["topics", "cards"] as const).map((k) => (
          <div key={k} className="field">
            <label htmlFor={`rs-${k}`}>{k === "topics" ? L("Topic review schedule", "Konu tekrarı takvimi") : L("Flashcard schedule", "Kart takvimi")}</label>
            <select id={`rs-${k}`} className="select" value={p.retentionStrategies?.[k] ?? (k === "topics" ? "ladder" : "sm2")} onChange={(e) => act((d) => { d.preferences.retentionStrategies = { ...d.preferences.retentionStrategies, [k]: e.target.value as RetentionStrategyId }; })}>
              {Object.values(RETENTION_STRATEGIES).map((s) => <option key={s.id} value={s.id}>{s.label()}</option>)}
            </select>
            <span className="tiny muted">{RETENTION_STRATEGIES[(p.retentionStrategies?.[k] ?? (k === "topics" ? "ladder" : "sm2")) as RetentionStrategyId]?.description()}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function BackupsPanel() {
  const db = useDB();
  const [list, setList] = useState<SnapshotInfo[] | null>(null);
  const snaps = store.snapshotStore;
  const refresh = () => void snaps?.list().then(setList);
  useEffect(refresh, []);
  return (
    <section className="card stack">
      <h2>{L("Automatic backups", "Otomatik yedekler")}</h2>
      <label className="row nowrap"><input type="checkbox" checked={db.preferences.autoBackup} onChange={(e) => act((d) => { d.preferences.autoBackup = e.target.checked; })} style={{ width: 20, height: 20 }} /> {L("Keep a dated copy on this device every day (last 7)", "Her gün bu cihazda tarihli bir kopya tut (son 7)")}</label>
      {!snaps ? <p className="small muted">{L("This storage does not support local snapshots; use Export backup.", "Bu depolama yerel anlık görüntüleri desteklemiyor; Yedeği dışa aktar'ı kullan.")}</p> : (
        <>
          <div className="list">
            {(list ?? []).map((s) => (
              <div key={s.key} className="list-item small">
                <span className="grow">{s.key}</span>
                <span className="tiny muted">{Math.round(s.size / 1024)} KB · {fmtDate(s.at)}</span>
                <button className="btn small" onClick={async () => {
                  if (!confirm(L(`Restore the copy "${s.key}"? The current state is saved first, so this can be undone.`, `"${s.key}" kopyası geri yüklensin mi? Mevcut durum önce kaydedilir; geri alınabilir.`))) return;
                  toast((await store.restoreSnapshot(s.key)) ? L("Restored.", "Geri yüklendi.") : L("That copy could not be read.", "Bu kopya okunamadı."), "info");
                  refresh();
                }}>{L("Restore", "Geri yükle")}</button>
              </div>
            ))}
            {list && !list.length && <p className="small muted" style={{ padding: 8 }}>{L("No snapshots yet; the first is taken with the next save.", "Henüz anlık görüntü yok; ilki bir sonraki kayıtta alınır.")}</p>}
          </div>
          <button className="btn small" style={{ alignSelf: "flex-start" }} onClick={async () => { await store.snapshotNow(); refresh(); toast(L("Snapshot taken.", "Anlık görüntü alındı.")); }}>{L("Take a snapshot now", "Şimdi anlık görüntü al")}</button>
        </>
      )}
    </section>
  );
}

export function SystemHealth() {
  const db = useDB();
  const [open, setOpen] = useState(false);
  const [snapCount, setSnapCount] = useState<number | null>(null);
  useEffect(() => { if (open) void store.snapshotStore?.list().then((l) => setSnapCount(l.length)); }, [open]);
  const g = getGraph(db.knowledge);
  const h = open ? healthReport(db, g, { backend: store.backend, size: store.lastSize || null, lastSavedAt: store.lastSavedAt, lastError: store.lastSaveError, snapshots: snapCount }) : null;
  const m = open ? maintenanceSuggestions(db, g) : [];
  return (
    <section className="card stack">
      <button className="row between" style={{ background: "none", border: 0, color: "inherit", padding: 0, cursor: "pointer" }} onClick={() => setOpen(!open)} aria-expanded={open}>
        <h2 style={{ margin: 0 }}>{L("System health", "Sistem sağlığı")}</h2><span className="tiny muted">{open ? "−" : "+"}</span>
      </button>
      {h && (
        <div className="stack small" style={{ gap: 6 }}>
          <span>{L("Graph", "Grafik")}: v{h.graph.version} · {h.graph.objects} · {L(`${h.graph.errors} errors, ${h.graph.warnings} warnings, ${h.graph.info} notes`, `${h.graph.errors} hata, ${h.graph.warnings} uyarı, ${h.graph.info} not`)}</span>
          <span>{L("Data", "Veri")}: {h.data.issues.length ? L(`${h.data.issues.length} issues`, `${h.data.issues.length} sorun`) : L("no integrity issues", "bütünlük sorunu yok")} · {L(`${h.data.events} events`, `${h.data.events} olay`)}</span>
          {h.data.issues.slice(0, 3).map((x, i) => <span key={i} className="tiny" style={{ color: "var(--review)" }}>{x}</span>)}
          <span>{L("Schema", "Şema")}: v{h.schema.version} · {h.schema.migrations.map((x) => x.id).join(", ")}</span>
          <span>{L("AI", "YZ")}: {h.ai.provider} · {L(`${h.ai.calls} calls (30 d), ${h.ai.ok} ok, ${h.ai.fallbacks} fallbacks`, `${h.ai.calls} çağrı (30 g), ${h.ai.ok} başarılı, ${h.ai.fallbacks} yedek`)} · {L(`cache ${aiCacheSize()}`, `önbellek ${aiCacheSize()}`)} <button className="btn small ghost" onClick={() => { clearAICache(); toast(L("AI cache cleared.", "YZ önbelleği temizlendi.")); }}>{L("clear", "temizle")}</button></span>
          {h.ai.lastError && <span className="tiny muted">{L("Last AI error", "Son YZ hatası")}: {h.ai.lastError.slice(0, 120)}</span>}
          <span>{L("Storage", "Depolama")}: {h.storage.backend}{h.storage.sizeKB !== null ? ` · ${h.storage.sizeKB} KB` : ""}{h.storage.lastSavedAt ? ` · ${L("saved", "kaydedildi")} ${fmtDate(h.storage.lastSavedAt, { hour: "2-digit", minute: "2-digit" })}` : ""}{h.storage.snapshots !== null ? ` · ${L(`${h.storage.snapshots} snapshots`, `${h.storage.snapshots} anlık görüntü`)}` : ""}</span>
          {h.storage.lastError && <span className="tiny" style={{ color: "var(--danger)" }}>{h.storage.lastError}</span>}
          {m.length > 0 && <strong className="small" style={{ marginTop: 6 }}>{L("Maintenance suggestions", "Bakım önerileri")}</strong>}
          {m.map((x, i) => <button key={i} className="list-item small" style={{ textAlign: "left" }} onClick={() => navigate(x.href)}>{x.text}</button>)}
          <span className="tiny muted">{L("Suggestions never change anything by themselves; each opens the place to review it.", "Öneriler kendi başına hiçbir şeyi değiştirmez; her biri gözden geçirileceği yeri açar.")}</span>
        </div>
      )}
    </section>
  );
}
