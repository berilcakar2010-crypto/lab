import { useState } from "react";
import { buildCurriculumAI } from "../../ai/curriculumAI";
import type { CurriculumSpec } from "../../engines/curriculumSpec";
import { importCurriculum } from "../../engines/curriculumSpec";
import { assertValidCourse } from "../../engines/curriculum";
import { logEvent } from "../../engines/analytics";
import { aiHost, navigate, store, toast, useAsync, useDB } from "../state";
import { Icon, TYPE_LABEL, minutes } from "../components/common";
import { getGraph } from "../../knowledge/graph";
import { matchRequest } from "../../knowledge/search";
import { personalGraph, readiness } from "../../knowledge/state";
import { setPath, studyObjects, toggleGoal } from "../../knowledge/actions";
import { L, lower, pick } from "../../i18n";

const examples = () => pick(["Physics Olympiad Mechanics", "Calculus 1", "Computational Neuroscience"], ["TÜBİTAK Fizik Olimpiyatı Mekanik", "Kalkülüs 1", "Kuramsal Sinirbilim"]);

interface Draft {
  spec: CurriculumSpec;
  note: string;
  provider: string;
  fallbackUsed: boolean;
  error?: string;
  request: string;
  syllabus: string;
}

export function BuilderPage() {
  const db = useDB();
  const [request, setRequest] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [showSyllabus, setShowSyllabus] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const { busy, run } = useAsync();
  const provider = db.preferences.aiProvider;
  const providerReady = provider !== "local" && !!db.preferences.apiKeys[provider];

  const build = () =>
    run(async () => {
      if (!request.trim() && !syllabus.trim()) {
        toast(L("Describe the course or paste a syllabus first.", "Önce dersi tarif et ya da bir müfredat yapıştır."), "error");
        return;
      }
      const res = await buildCurriculumAI(aiHost, { request: request.trim() || L("My course", "Dersim"), syllabus });
      setDraft({ ...res.value, provider: res.provider, fallbackUsed: res.fallbackUsed, error: res.error, request, syllabus });
    });

  const accept = () => {
    if (!draft) return;
    try {
      let courseId = "";
      const report = store.transact(
        (d) => {
          const r = importCurriculum(d, draft.spec, {
            source: { kind: draft.syllabus.trim() ? "SYLLABUS" : "REQUEST", text: draft.syllabus.trim() || draft.request },
            generatedBy: draft.provider,
          });
          logEvent(d, "CURRICULUM_EDIT", { courseId: r.courseId }, { action: "create", provider: draft.provider, milestones: r.milestoneCount });
          courseId = r.courseId;
          return r;
        },
        (d) => assertValidCourse(d, courseId),
      );
      if (report.repairs.length) toast(L(`Imported with ${report.repairs.length} automatic repair(s).`, `${report.repairs.length} otomatik düzeltmeyle içe aktarıldı.`));
      navigate(`/course/${report.courseId}?calibrate=1`);
    } catch (e) {
      toast(e instanceof Error ? e.message : String(e), "error");
    }
  };

  const onFile = async (file: File) => {
    if (!/\.(txt|md|markdown|csv|tex)$/i.test(file.name) && !file.type.startsWith("text/")) {
      toast(L("Upload a plain-text file (.txt, .md). For PDFs, copy the table of contents and paste it.", "Düz metin dosyası yükle (.txt, .md). PDF için içindekiler bölümünü kopyalayıp yapıştır."), "error");
      return;
    }
    const text = await file.text();
    setSyllabus(text.slice(0, 50_000));
    setShowSyllabus(true);
    if (!request.trim()) setRequest(file.name.replace(/\.[^.]+$/, ""));
  };

  if (draft) return <DraftPreview draft={draft} onAccept={accept} onBack={() => setDraft(null)} onRegenerate={build} busy={busy} />;

  return (
    <div className="stack-lg rise">
      <header className="stack" style={{ gap: 6 }}>
        <button className="btn ghost small" style={{ alignSelf: "flex-start" }} onClick={() => history.back()}><Icon.back /> {L("Back", "Geri")}</button>
        <h1>{L("New course", "Yeni ders")}</h1>
        <p className="text-2">{L("Name a goal or paste a syllabus. Lab turns it into a graph of meaningful milestones — then you shape it.", "Bir hedef yaz ya da müfredat yapıştır. Lab bunu anlamlı adımlardan oluşan bir haritaya dönüştürür — sonra onu sen şekillendirirsin.")}</p>
      </header>

      <div className="card stack">
        <div className="field">
          <label htmlFor="req">{L("What do you want to master?", "Neyde ustalaşmak istiyorsun?")}</label>
          <input id="req" className="input" placeholder={L("e.g. Calculus 1, or Physics Olympiad Mechanics", "örn. Kalkülüs 1 ya da Fizik Olimpiyatı Mekanik")} value={request} onChange={(e) => setRequest(e.target.value)} />
        </div>
        <div className="row" style={{ gap: 6 }}>
          {examples().map((ex) => (
            <button key={ex} className="btn small ghost" onClick={() => setRequest(ex)} style={{ border: "1px solid var(--border)" }}>{ex}</button>
          ))}
        </div>
        {showSyllabus ? (
          <div className="field">
            <label htmlFor="syl">{L("Syllabus, table of contents, exam specification or topic list", "Müfredat, içindekiler, sınav kapsamı ya da konu listesi")}</label>
            <textarea id="syl" className="textarea" style={{ minHeight: 200 }} value={syllabus} onChange={(e) => setSyllabus(e.target.value)}
              placeholder={L("Unit 1: Kinematics\n- Displacement and velocity\n- Acceleration\nUnit 2: Dynamics\n- Newton's laws", "Ünite 1: Kinematik\n- Yer değiştirme ve hız\n- İvme\nÜnite 2: Dinamik\n- Newton yasaları")} />
          </div>
        ) : (
          <div className="row">
            <button className="btn small" onClick={() => setShowSyllabus(true)}>{L("Paste a syllabus", "Müfredat yapıştır")}</button>
            <label className="btn small" style={{ cursor: "pointer" }}>
              {L("Upload text file", "Metin dosyası yükle")}
              <input type="file" accept=".txt,.md,.markdown,.csv,.tex,text/*" hidden onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
            </label>
          </div>
        )}
        <GraphCheck request={request} />
        <div className={`banner ${providerReady ? "info" : "warn"}`}>
          {providerReady
            ? L(`AI provider: ${provider === "gemini" ? "Gemini" : "Groq"}. If it fails, Lab falls back to the offline builder.`, `YZ sağlayıcısı: ${provider === "gemini" ? "Gemini" : "Groq"}. Başarısız olursa Lab çevrimdışı oluşturucuya geçer.`)
            : L("Offline builder: built-in packs for mechanics and calculus; other subjects become an editable scaffold. Add a Gemini or Groq key in Settings for content-aware curricula.", "Çevrimdışı oluşturucu: mekanik ve kalkülüs için hazır paketler var; diğer konular düzenlenebilir bir iskelete dönüşür. İçeriğe duyarlı müfredat için Ayarlar'dan Gemini ya da Groq anahtarı ekle.")}
        </div>
        <button className="btn primary block" onClick={build} disabled={busy}>
          {busy ? <><span className="spinner" /> {L("Structuring the knowledge graph…", "Bilgi haritası yapılandırılıyor…")}</> : <>{L("Build curriculum", "Müfredatı oluştur")}</>}
        </button>
      </div>
    </div>
  );
}

function DraftPreview({ draft, onAccept, onBack, onRegenerate, busy }: { draft: Draft; onAccept: () => void; onBack: () => void; onRegenerate: () => void; busy: boolean }) {
  const { spec } = draft;
  const all = spec.units.flatMap((u) => u.topics.flatMap((t) => t.milestones));
  const types = all.reduce<Record<string, number>>((acc, m) => ((acc[(m.type ?? "PRACTICE").toUpperCase()] = (acc[(m.type ?? "PRACTICE").toUpperCase()] ?? 0) + 1), acc), {});
  const total = all.reduce((s, m) => s + (Number(m.estimatedMinutes) || 15), 0);
  return (
    <div className="stack-lg rise">
      <header className="stack" style={{ gap: 6 }}>
        <span className="eyebrow">{L("Draft curriculum", "Taslak müfredat")}</span>
        <h1>{spec.title}</h1>
        <p className="text-2">{spec.goal}</p>
      </header>
      {draft.fallbackUsed && draft.error && <div className="banner warn">{L(`The AI provider failed (${draft.error}). This draft comes from the offline builder.`, `YZ sağlayıcısı başarısız oldu (${draft.error}). Bu taslak çevrimdışı oluşturucudan geliyor.`)}</div>}
      <div className="banner info">{draft.note}</div>
      <div className="grid-2">
        <div className="card"><div className="eyebrow">{L("Milestones", "Adımlar")}</div><div className="serif" style={{ fontSize: 28 }}>{all.length}</div><div className="small muted">≈ {minutes(total)} {L("of focused work, unevenly sized by design", "odaklı çalışma; adımlar bilerek farklı büyüklükte")}</div></div>
        <div className="card"><div className="eyebrow">{L("Shape", "Yapı")}</div><div className="small text-2" style={{ marginTop: 6 }}>{Object.entries(types).map(([t, n]) => `${n} ${TYPE_LABEL[t as keyof typeof TYPE_LABEL] !== undefined ? lower(TYPE_LABEL[t as keyof typeof TYPE_LABEL]) : t}`).join(" · ")}</div></div>
      </div>
      <div className="stack">
        {spec.units.map((u, i) => (
          <div key={i} className="card stack" style={{ gap: 8 }}>
            <h3>{u.title}</h3>
            {u.summary && <p className="small muted">{u.summary}</p>}
            {u.topics.map((t, j) => (
              <div key={j} className="stack" style={{ gap: 4 }}>
                <div className="small text-2" style={{ fontWeight: 600 }}>{t.title}</div>
                {t.milestones.map((m, k) => (
                  <div key={k} className="row nowrap small" style={{ gap: 8 }}>
                    <span className="chip" style={{ minWidth: 0 }}>{TYPE_LABEL[(m.type ?? "PRACTICE").toUpperCase() as keyof typeof TYPE_LABEL] ?? m.type}</span>
                    <span className="grow">{m.title}{m.optional ? <span className="muted"> · {L("optional", "isteğe bağlı")}</span> : null}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="row" style={{ position: "sticky", bottom: "calc(var(--nav-h) + 12px)" }}>
        <button className="btn" onClick={onBack} disabled={busy}>{L("Back", "Geri")}</button>
        <button className="btn" onClick={onRegenerate} disabled={busy}>{busy ? <span className="spinner" /> : L("Regenerate", "Yeniden oluştur")}</button>
        <button className="btn primary grow" onClick={onAccept} disabled={busy}>{L("Accept and find my starting point", "Kabul et ve başlangıç noktamı bul")}</button>
      </div>
    </div>
  );
}

/** Section 37: look in the existing graph first; never force the learner backward. */
function GraphCheck({ request }: { request: string }) {
  const db = useDB();
  if (request.trim().length < 3) return null;
  const g = getGraph(db.knowledge);
  const match = matchRequest(g, request);
  const targets = match.path ? match.path.targets : match.objects.slice(0, 3);
  if (!targets.length) return null;
  const pg = personalGraph(db, g);
  const ready = readiness(pg, targets);
  const known = ready.known.length;
  const gaps = ready.requiredGaps.length;
  const createFromGraph = () => {
    try {
      const courseId = store.transact((d) => {
        for (const t of targets) if (!d.knowledge.goals.includes(t)) toggleGoal(d, t);
        return studyObjects(d, g, targets, request.trim());
      });
      navigate(`/course/${courseId}`);
    } catch (e) {
      toast(e instanceof Error ? e.message : String(e), "error");
    }
  };
  return (
    <div className="card stack graph-check" style={{ gap: 8 }}>
      <span className="eyebrow">{L("Already in the knowledge graph", "Bilgi grafiğinde zaten var")}</span>
      {match.path ? (
        <p className="small text-2">{L("The learning path ", "")}<strong>{match.path.title}</strong>{L(" covers this request. Instead of building a separate course, you can see the same graph through this path.", " öğrenme yolu bu isteği karşılıyor. Ayrı bir ders kurmak yerine aynı grafiği bu yoldan görebilirsin.")}</p>
      ) : (
        <p className="small text-2">{L("Related objects: ", "İlgili nesneler: ")}{targets.map((t) => g.objects[t].title).join(", ")}.</p>
      )}
      <p className="small">
        {known > 0 && gaps === 0 ? L("You already have enough background for most of this. ", "Bu alanların çoğunda yeterli altyapın var. ") : ""}
        {gaps > 0 ? L(`You seem to be missing ${gaps} required prerequisite${gaps > 1 ? "s" : ""}${known ? `; you already know ${known}` : ""}. `, `${gaps} zorunlu önkoşulda eksik görünüyorsun${known ? `; ${known} tanesini zaten biliyorsun` : ""}. `) : ""}
        {gaps > 0 && ready.startHere.length ? L(`Suggested starting point: ${ready.startHere.slice(0, 3).map((id) => g.objects[id].title).join(", ")}. Not required.`, `Buradan başlaman öneriliyor: ${ready.startHere.slice(0, 3).map((id) => g.objects[id].title).join(", ")}. Zorunlu değil.`) : ""}
        {gaps === 0 && known === 0 ? L("Your required prerequisites are in place; you can start right away.", "Zorunlu önkoşulların tamam; doğrudan başlayabilirsin.") : ""}
      </p>
      <div className="row">
        {match.path ? (
          <button className="btn small" onClick={() => { store.transact((d) => setPath(d, match.path!.id)); navigate("/graph?view=yollar"); }}>{L("Open the path in the graph", "Yolu grafikte aç")}</button>
        ) : (
          <button className="btn small" onClick={createFromGraph}>{L("Create a course from the graph", "Grafikten ders oluştur")}</button>
        )}
        <button className="btn small ghost" onClick={() => navigate(`/graph?lo=${encodeURIComponent(targets[0])}`)}>{L("Details", "Ayrıntılar")}</button>
      </div>
    </div>
  );
}
