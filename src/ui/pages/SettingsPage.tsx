import { useState } from "react";
import type { AIProviderId, HintLevel } from "../../domain/types";
import { HINT_LEVELS } from "../../domain/types";
import { act, store, toast, useAsync, useDB } from "../state";
import { makeProvider } from "../../ai/providers";
import { hydrateDB } from "../../data/db";
import { recomputeAll } from "../../engines/progress";

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
    toast("Keys saved on this device.");
  };

  const test = () => run(async () => {
    const provider = makeProvider(store.state.preferences);
    if (!provider.ready()) {
      toast(prefs.aiProvider === "local" ? "Offline mode needs no test." : "Add a key first.", "error");
      return;
    }
    const text = await provider.complete({ system: "Reply with JSON only.", prompt: 'Return {"ok": true}', json: true, maxTokens: 50 });
    toast(text.includes("ok") ? `${provider.id} responded.` : `Unexpected reply: ${text.slice(0, 80)}`);
  });

  const exportData = () => {
    const blob = new Blob([JSON.stringify(store.state, null, 1)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `lab-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importData = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text());
      if (!parsed || typeof parsed !== "object" || !("milestones" in parsed)) throw new Error("This is not a Lab backup file.");
      if (!confirm("Replace all current data with this backup? Export first if unsure.")) return;
      const db2 = hydrateDB(parsed);
      recomputeAll(db2);
      store.replace(db2);
      toast("Backup restored.");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not read the file.", "error");
    }
  };

  return (
    <div className="stack-lg rise">
      <h1>Settings</h1>

      <section className="card stack">
        <h2>AI provider</h2>
        <p className="small text-2">Every AI feature works through one interface, so providers can be swapped at any time. If a call fails, Lab falls back to its offline behaviour.</p>
        <div className="tabs">
          {(["local", "gemini", "groq"] as AIProviderId[]).map((p) => (
            <button key={p} className={prefs.aiProvider === p ? "on" : ""} onClick={() => setProvider(p)}>{p === "local" ? "Offline" : p === "gemini" ? "Gemini" : "Groq"}</button>
          ))}
        </div>
        <div className="field"><label htmlFor="gk">Gemini API key</label><input id="gk" className="input mono" type="password" autoComplete="off" value={keys.gemini} onChange={(e) => setKeys({ ...keys, gemini: e.target.value })} /></div>
        <div className="field"><label htmlFor="gm">Gemini model</label><input id="gm" className="input mono" value={prefs.models.gemini} onChange={(e) => act((d) => void (d.preferences.models.gemini = e.target.value))} /></div>
        <div className="field"><label htmlFor="qk">Groq API key</label><input id="qk" className="input mono" type="password" autoComplete="off" value={keys.groq} onChange={(e) => setKeys({ ...keys, groq: e.target.value })} /></div>
        <div className="field"><label htmlFor="qm">Groq model</label><input id="qm" className="input mono" value={prefs.models.groq} onChange={(e) => act((d) => void (d.preferences.models.groq = e.target.value))} /></div>
        <div className="row">
          <button className="btn primary" onClick={saveKeys}>Save keys</button>
          <button className="btn" onClick={test} disabled={busy}>{busy ? <span className="spinner" /> : "Test connection"}</button>
        </div>
        <p className="tiny muted">Keys are stored only in this browser and sent only to the provider you choose.</p>
      </section>

      <AILog />

      <section className="card stack">
        <h2>Help and struggle</h2>
        <div className="field">
          <label htmlFor="cap">Highest help level offered before you explicitly unlock more</label>
          <select id="cap" className="select" value={prefs.hintCap} onChange={(e) => act((d) => void (d.preferences.hintCap = Number(e.target.value) as HintLevel))}>
            {HINT_LEVELS.slice(1).map((l, i) => <option key={l} value={i + 1}>{i + 1}. {l.replace(/_/g, " ").toLowerCase()}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="ret">Days before the first delayed retention check</label>
          <input id="ret" className="input" type="number" min={1} max={30} value={prefs.retentionDelayDays} onChange={(e) => act((d) => void (d.preferences.retentionDelayDays = Math.max(1, Math.min(30, Number(e.target.value) || 3))))} />
        </div>
        <label className="row nowrap"><input type="checkbox" checked={prefs.reduceMotion} onChange={(e) => act((d) => void (d.preferences.reduceMotion = e.target.checked))} style={{ width: 20, height: 20 }} /> Reduce motion</label>
        <label className="row nowrap"><input type="checkbox" checked={prefs.experimentsEnabled} onChange={(e) => act((d) => void (d.preferences.experimentsEnabled = e.target.checked))} style={{ width: 20, height: 20 }} /> Allow personal experiments to vary session conditions</label>
      </section>

      <section className="card stack">
        <h2>Your data</h2>
        <p className="small text-2">Everything lives on this device. Export a backup regularly; raw events are included so statistics can be recalculated.</p>
        <div className="small muted">{Object.keys(db.milestones).length} milestones · {Object.keys(db.attempts).length} attempts · {db.events.length} raw events</div>
        {store.lastSaveError && <div className="banner error">Last save failed: {store.lastSaveError}. Export a backup now.</div>}
        <div className="row">
          <button className="btn" onClick={exportData}>Export backup</button>
          <label className="btn" style={{ cursor: "pointer" }}>Restore backup<input type="file" accept="application/json,.json" hidden onChange={(e) => e.target.files?.[0] && importData(e.target.files[0])} /></label>
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
      <h2>AI activity</h2>
      <p className="small text-2">{list.length} AI requests · {failed} fell back to offline behaviour. Roles share one provider interface.</p>
      <div className="list">
        {list.slice(0, 8).map((x) => (
          <div key={x.id} className="list-item small">
            <span className="chip">{x.role.toLowerCase().replace(/_/g, " ")}</span>
            <span className="grow truncate">{x.summary}</span>
            <span className={x.ok ? "muted" : ""} style={x.ok ? undefined : { color: "var(--review)" }}>{x.ok ? `${x.provider} · ${(x.latencyMs / 1000).toFixed(1)}s` : `fallback${x.error ? ` (${x.error.slice(0, 40)})` : ""}`}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
