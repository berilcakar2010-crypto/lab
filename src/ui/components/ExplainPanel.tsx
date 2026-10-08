import { useEffect, useRef, useState } from "react";
import type { Explanation, ExplanationEvaluation, LabDB } from "../../domain/types";
import { fmtDate, getLang, L } from "../../i18n";
import { evaluateExplanation, transcribeWithGroq } from "../../ai/studyAI";
import { addExplanation, deleteExplanation, setEvaluation } from "../../study/actions";
import { blobToDataURL, extFor, media } from "../../data/media";
import type { KnowledgeGraph, LearningObject } from "../../knowledge/schema";
import { aiHost, store, toast, useAsync } from "../state";
import { saveBlobFile } from "../native";

type Mode = Explanation["mode"];
const MAX_SECONDS = 180;
/** Gemini accepts inline media up to ~20 MB per request; stay well below. */
const MAX_INLINE_BYTES = 14 * 1024 * 1024;

function pickMime(video: boolean): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  const opts = video ? ["video/webm;codecs=vp8,opus", "video/webm", "video/mp4"] : ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"];
  return opts.find((m) => MediaRecorder.isTypeSupported?.(m));
}

type SpeechRec = { lang: string; continuous: boolean; interimResults: boolean; start(): void; stop(): void; onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null; onerror: (() => void) | null };
function speechRecognition(): SpeechRec | null {
  const w = window as unknown as { SpeechRecognition?: new () => SpeechRec; webkitSpeechRecognition?: new () => SpeechRec };
  const C = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  return C ? new C() : null;
}

/** Records audio or video (with a live transcript where the browser offers speech recognition). */
function Recorder({ video, onDone }: { video: boolean; onDone: (blob: Blob, mime: string, seconds: number, transcript: string) => void }) {
  const [state, setState] = useState<"idle" | "rec" | "denied">("idle");
  const [secs, setSecs] = useState(0);
  const [live, setLive] = useState("");
  const rec = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<number>();
  const sr = useRef<SpeechRec | null>(null);
  const finalText = useRef("");
  const preview = useRef<HTMLVideoElement>(null);
  const started = useRef(0);

  const stopAll = () => {
    window.clearInterval(timer.current);
    try { sr.current?.stop(); } catch { /* already stopped */ }
    stream.current?.getTracks().forEach((t) => t.stop());
  };
  useEffect(() => stopAll, []);

  const start = async () => {
    const mime = pickMime(video);
    if (!navigator.mediaDevices?.getUserMedia || !mime) {
      toast(L("Recording is not supported on this device.", "Bu cihazda kayıt desteklenmiyor."), "error");
      return;
    }
    try {
      stream.current = await navigator.mediaDevices.getUserMedia(video ? { audio: true, video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" } } : { audio: true });
    } catch {
      setState("denied");
      return;
    }
    if (video && preview.current) {
      preview.current.srcObject = stream.current;
      void preview.current.play().catch(() => undefined);
    }
    chunks.current = [];
    const r = new MediaRecorder(stream.current, { mimeType: mime, audioBitsPerSecond: 48_000, ...(video ? { videoBitsPerSecond: 450_000 } : {}) });
    r.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
    r.onstop = () => {
      const seconds = Math.round((Date.now() - started.current) / 1000);
      stopAll();
      onDone(new Blob(chunks.current, { type: mime.split(";")[0] }), mime.split(";")[0], seconds, finalText.current.trim());
      setState("idle");
    };
    rec.current = r;
    finalText.current = "";
    setLive("");
    const s = speechRecognition();
    if (s) {
      s.lang = getLang() === "tr" ? "tr-TR" : "en-GB";
      s.continuous = true;
      s.interimResults = true;
      s.onresult = (e) => {
        let interim = "";
        let fin = "";
        for (let i = 0; i < e.results.length; i++) {
          const res = e.results[i];
          if (res.isFinal) fin += `${res[0].transcript} `;
          else interim += res[0].transcript;
        }
        finalText.current = fin;
        setLive(`${fin}${interim}`);
      };
      s.onerror = () => undefined;
      try { s.start(); sr.current = s; } catch { sr.current = null; }
    }
    started.current = Date.now();
    r.start(1000);
    setSecs(0);
    setState("rec");
    timer.current = window.setInterval(() => {
      const t = Math.round((Date.now() - started.current) / 1000);
      setSecs(t);
      if (t >= MAX_SECONDS && rec.current?.state === "recording") rec.current.stop();
    }, 500);
  };

  return (
    <div className="stack" style={{ gap: 8 }}>
      {video && <video ref={preview} className="rec-preview" muted playsInline style={{ display: state === "rec" ? "block" : "none" }} />}
      {state === "denied" && <div className="banner warn small">{L("Permission to use the microphone/camera was denied. Allow it in the system settings and try again.", "Mikrofon/kamera izni verilmedi. Sistem ayarlarından izin verip yeniden dene.")}</div>}
      <div className="row">
        {state !== "rec" ? (
          <button className="btn primary" onClick={start}>● {video ? L("Record video", "Video kaydet") : L("Record audio", "Ses kaydet")}</button>
        ) : (
          <button className="btn primary rec-on" onClick={() => rec.current?.stop()}>■ {L("Stop", "Durdur")} · {Math.floor(secs / 60)}:{String(secs % 60).padStart(2, "0")}</button>
        )}
        <span className="tiny muted">{L(`Up to ${MAX_SECONDS / 60} minutes.`, `En fazla ${MAX_SECONDS / 60} dakika.`)}</span>
      </div>
      {state === "rec" && live && <p className="small text-2 live-transcript">{live}</p>}
    </div>
  );
}

function SelfRubric({ o, e }: { o: LearningObject; e: Explanation }) {
  const ev = e.evaluation;
  const criteria = ev?.criteria.length ? ev.criteria : o.masteryCriteria.map((c) => ({ criterion: c, met: false }));
  const toggle = (i: number) => {
    const next = criteria.map((c, k) => (k === i ? { ...c, met: !c.met } : c));
    const score = next.filter((c) => c.met).length / Math.max(1, next.length);
    const evaluation: ExplanationEvaluation = ev
      ? { ...ev, criteria: next, score: ev.by === "ai" ? ev.score : score }
      : { score, criteria: next, strengths: [], gaps: [], misconceptions: [], feedback: L("Self-assessed against the mastery criteria.", "Ustalık ölçütlerine göre kendi değerlendirmen."), provider: "local", by: "self", at: Date.now() };
    store.transact((d) => setEvaluation(d, e.id, evaluation));
  };
  return (
    <div className="stack" style={{ gap: 4 }}>
      {criteria.map((c, i) => (
        <label key={i} className="row nowrap small" style={{ alignItems: "flex-start", gap: 8 }}>
          <input type="checkbox" checked={c.met} onChange={() => toggle(i)} />
          <span>{c.criterion}{(c as { comment?: string }).comment ? <span className="muted"> — {(c as { comment?: string }).comment}</span> : null}</span>
        </label>
      ))}
    </div>
  );
}

function MediaPlayer({ e }: { e: Explanation }) {
  const [url, setUrl] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    let u: string | null = null;
    if (e.mediaId) void media.get(e.mediaId).then((b) => (b ? setUrl((u = URL.createObjectURL(b))) : setMissing(true)));
    return () => { if (u) URL.revokeObjectURL(u); };
  }, [e.mediaId]);
  if (missing) return <span className="tiny muted">{L("Recording not found on this device.", "Kayıt bu cihazda bulunamadı.")}</span>;
  if (!url) return null;
  return e.mode === "VIDEO" ? <video src={url} controls playsInline className="rec-preview" /> : <audio src={url} controls style={{ width: "100%" }} />;
}

function ExplanationCard({ e, o, open }: { e: Explanation; o: LearningObject; open: boolean }) {
  const ev = e.evaluation;
  const download = async () => {
    const b = e.mediaId ? await media.get(e.mediaId) : undefined;
    if (b) await saveBlobFile(`lab-explanation-${o.id}-${new Date(e.createdAt).toISOString().slice(0, 10)}.${extFor(b.type || e.mime || "")}`, b);
  };
  const remove = async () => {
    if (!confirm(L("Delete this explanation (and its recording)?", "Bu anlatım (ve kaydı) silinsin mi?"))) return;
    if (e.mediaId) await media.delete(e.mediaId);
    store.transact((d) => deleteExplanation(d, e.id));
  };
  return (
    <details className="card" open={open || !ev}>
      <summary className="row between nowrap" style={{ cursor: "pointer" }}>
        <span className="small">{fmtDate(e.createdAt, { day: "numeric", month: "short" })} · {e.mode === "TEXT" ? L("text", "metin") : e.mode === "AUDIO" ? L("audio", "ses") : L("video", "video")}{e.durationSec ? ` · ${e.durationSec}s` : ""}</span>
        {ev && <span className={`chip ${ev.score >= 0.75 ? "s-MASTERED" : ev.score >= 0.4 ? "s-ATTEMPTED" : "s-NEEDS_REVIEW"}`}>{Math.round(ev.score * 100)}% · {ev.by === "ai" ? ev.provider : L("self", "kendi")}</span>}
      </summary>
      <div className="stack" style={{ marginTop: 8 }}>
        <MediaPlayer e={e} />
        {e.text && <p className="small text-2" style={{ whiteSpace: "pre-wrap", margin: 0 }}>{e.text}</p>}
        {e.transcript && <p className="small text-2" style={{ whiteSpace: "pre-wrap", margin: 0 }}><span className="eyebrow">{L("Transcript", "Döküm")} </span>{e.transcript}</p>}
        {ev?.feedback && <div className="banner info small">{ev.feedback}</div>}
        {!!ev?.strengths.length && <ul className="small tight">{ev.strengths.map((s) => <li key={s}>✓ {s}</li>)}</ul>}
        {!!ev?.gaps.length && <ul className="small tight">{ev.gaps.map((s) => <li key={s}>△ {s}</li>)}</ul>}
        {!!ev?.misconceptions.length && <ul className="small tight" style={{ color: "var(--review)" }}>{ev.misconceptions.map((s) => <li key={s}>! {s}</li>)}</ul>}
        <span className="eyebrow">{L("Mastery criteria", "Ustalık ölçütleri")}</span>
        <SelfRubric o={o} e={e} />
        <div className="row">
          {e.mediaId && <button className="btn small ghost" onClick={download}>{L("Export recording", "Kaydı dışa aktar")}</button>}
          <button className="btn small ghost" onClick={remove}>{L("Delete", "Sil")}</button>
        </div>
      </div>
    </details>
  );
}

/** Explain the logic in your own words — typed, spoken or on camera — and get it evaluated (Feynman technique). */
export function ExplainPanel({ db, g, loId }: { db: LabDB; g: KnowledgeGraph; loId: string }) {
  const o = g.objects[loId];
  const [mode, setMode] = useState<Mode>("TEXT");
  const [text, setText] = useState("");
  const { busy, run } = useAsync();
  const list = Object.values(db.explanations).filter((e) => e.loId === loId).sort((a, b) => b.createdAt - a.createdAt);
  const prompt = L(`Explain "${o.title}" as if teaching a friend: what it is, why it works, an example, and a common mistake.`, `"${o.title}" konusunu bir arkadaşına öğretir gibi anlat: ne olduğu, neden işe yaradığı, bir örnek ve sık yapılan bir hata.`);
  const prefs = db.preferences;

  const evaluate = async (id: string, input: { text?: string; transcript?: string; blob?: Blob; mime?: string }) => {
    let transcript = input.transcript;
    if (!input.text && !transcript && input.blob && prefs.aiProvider === "groq" && prefs.apiKeys.groq) {
      try {
        transcript = await transcribeWithGroq(prefs.apiKeys.groq, input.blob);
        store.transact((d) => { if (d.explanations[id]) d.explanations[id].transcript = transcript; });
      } catch {
        toast(L("Transcription failed; tick the criteria yourself.", "Yazıya dökme başarısız; ölçütleri kendin işaretle."), "error");
      }
    }
    const mediaDataUrl = !input.text && !transcript && input.blob && prefs.aiProvider === "gemini" && input.blob.size <= MAX_INLINE_BYTES ? await blobToDataURL(input.blob) : undefined;
    const res = await evaluateExplanation(aiHost, o, g, { text: input.text, transcript, mediaDataUrl, mime: input.mime });
    const { transcript: heard, ...evaluation } = res.value;
    store.transact((d) => setEvaluation(d, id, evaluation, heard));
    toast(res.fallbackUsed
      ? L("Saved. AI evaluation is not available — tick the criteria you showed.", "Kaydedildi. YZ değerlendirmesi yok — gösterdiğin ölçütleri işaretle.")
      : L(`Evaluated: ${Math.round(evaluation.score * 100)}%`, `Değerlendirildi: %${Math.round(evaluation.score * 100)}`));
  };

  const submitText = () => run(async () => {
    const e = store.transact((d) => addExplanation(d, { loId, prompt, mode: "TEXT", text: text.trim() }));
    setText("");
    await evaluate(e.id, { text: e.text });
  });

  const onRecorded = (blob: Blob, mime: string, seconds: number, transcript: string) => run(async () => {
    const mediaId = `media_${Date.now().toString(36)}`;
    await media.put(mediaId, blob);
    const e = store.transact((d) => addExplanation(d, { loId, prompt, mode, mediaId, mime, durationSec: seconds, sizeBytes: blob.size, transcript: transcript || undefined }));
    await evaluate(e.id, { transcript: transcript || undefined, blob, mime });
  });

  return (
    <div className="stack">
      <div className="card accent stack" style={{ gap: 6 }}>
        <span className="eyebrow">{L("Explain the logic", "Mantığını anlat")}</span>
        <p className="small" style={{ margin: 0 }}>{prompt}</p>
      </div>
      <div className="chip-scroll" role="tablist">
        {(["TEXT", "AUDIO", "VIDEO"] as Mode[]).map((m) => (
          <button key={m} role="tab" aria-selected={mode === m} className={`btn small ${mode === m ? "primary" : ""}`} onClick={() => setMode(m)}>
            {m === "TEXT" ? L("Write", "Yaz") : m === "AUDIO" ? L("Speak", "Sesli") : L("Video", "Video")}
          </button>
        ))}
      </div>
      {mode === "TEXT" ? (
        <div className="stack" style={{ gap: 8 }}>
          <textarea className="textarea" style={{ minHeight: 140 }} value={text} onChange={(e) => setText(e.target.value)} aria-label={L("Your explanation", "Anlatımın")}
            placeholder={L("In your own words…", "Kendi cümlelerinle…")} />
          <button className="btn primary" style={{ alignSelf: "flex-start" }} disabled={busy || text.trim().length < 20} onClick={submitText}>
            {busy ? <span className="spinner" /> : L("Save and evaluate", "Kaydet ve değerlendir")}
          </button>
        </div>
      ) : (
        <Recorder video={mode === "VIDEO"} onDone={onRecorded} />
      )}
      {busy && mode !== "TEXT" && <p className="small muted"><span className="spinner" /> {L("Saving and evaluating…", "Kaydediliyor ve değerlendiriliyor…")}</p>}
      <p className="tiny muted">{L("Recordings stay on this device. Gemini can listen to audio and video; Groq transcribes speech first; without a key you tick the criteria yourself.", "Kayıtlar bu cihazda kalır. Gemini sesi ve videoyu dinleyebilir; Groq önce konuşmayı yazıya döker; anahtar yoksa ölçütleri kendin işaretlersin.")}</p>
      {list.map((e, i) => <ExplanationCard key={e.id} e={e} o={o} open={i === 0} />)}
    </div>
  );
}
