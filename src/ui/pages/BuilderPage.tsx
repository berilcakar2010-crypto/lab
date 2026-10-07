import { useState } from "react";
import { buildCurriculumAI } from "../../ai/curriculumAI";
import type { CurriculumSpec } from "../../engines/curriculumSpec";
import { importCurriculum } from "../../engines/curriculumSpec";
import { assertValidCourse } from "../../engines/curriculum";
import { logEvent } from "../../engines/analytics";
import { aiHost, navigate, store, toast, useAsync, useDB } from "../state";
import { Icon, TYPE_LABEL, minutes } from "../components/common";

const EXAMPLES = ["TÜBİTAK Fizik Olimpiyatı Mekanik", "Kalkülüs 1", "Kuramsal Sinirbilim"];

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
        toast("Önce dersi tarif et ya da bir müfredat yapıştır.", "error");
        return;
      }
      const res = await buildCurriculumAI(aiHost, { request: request.trim() || "Dersim", syllabus });
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
      if (report.repairs.length) toast(`${report.repairs.length} otomatik düzeltmeyle içe aktarıldı.`);
      navigate(`/course/${report.courseId}?calibrate=1`);
    } catch (e) {
      toast(e instanceof Error ? e.message : String(e), "error");
    }
  };

  const onFile = async (file: File) => {
    if (!/\.(txt|md|markdown|csv|tex)$/i.test(file.name) && !file.type.startsWith("text/")) {
      toast("Düz metin dosyası yükle (.txt, .md). PDF için içindekiler bölümünü kopyalayıp yapıştır.", "error");
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
        <button className="btn ghost small" style={{ alignSelf: "flex-start" }} onClick={() => history.back()}><Icon.back /> Geri</button>
        <h1>Yeni ders</h1>
        <p className="text-2">Bir hedef yaz ya da müfredat yapıştır. Lab bunu anlamlı adımlardan oluşan bir haritaya dönüştürür — sonra onu sen şekillendirirsin.</p>
      </header>

      <div className="card stack">
        <div className="field">
          <label htmlFor="req">Neyde ustalaşmak istiyorsun?</label>
          <input id="req" className="input" placeholder="örn. Kalkülüs 1 ya da Fizik Olimpiyatı Mekanik" value={request} onChange={(e) => setRequest(e.target.value)} />
        </div>
        <div className="row" style={{ gap: 6 }}>
          {EXAMPLES.map((ex) => (
            <button key={ex} className="btn small ghost" onClick={() => setRequest(ex)} style={{ border: "1px solid var(--border)" }}>{ex}</button>
          ))}
        </div>
        {showSyllabus ? (
          <div className="field">
            <label htmlFor="syl">Müfredat, içindekiler, sınav kapsamı ya da konu listesi</label>
            <textarea id="syl" className="textarea" style={{ minHeight: 200 }} value={syllabus} onChange={(e) => setSyllabus(e.target.value)}
              placeholder={"Ünite 1: Kinematik\n- Yer değiştirme ve hız\n- İvme\nÜnite 2: Dinamik\n- Newton yasaları"} />
          </div>
        ) : (
          <div className="row">
            <button className="btn small" onClick={() => setShowSyllabus(true)}>Müfredat yapıştır</button>
            <label className="btn small" style={{ cursor: "pointer" }}>
              Metin dosyası yükle
              <input type="file" accept=".txt,.md,.markdown,.csv,.tex,text/*" hidden onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
            </label>
          </div>
        )}
        <div className={`banner ${providerReady ? "info" : "warn"}`}>
          {providerReady
            ? `YZ sağlayıcısı: ${provider === "gemini" ? "Gemini" : "Groq"}. Başarısız olursa Lab çevrimdışı oluşturucuya geçer.`
            : "Çevrimdışı oluşturucu: mekanik ve kalkülüs için hazır paketler var; diğer konular düzenlenebilir bir iskelete dönüşür. İçeriğe duyarlı müfredat için Ayarlar'dan Gemini ya da Groq anahtarı ekle."}
        </div>
        <button className="btn primary block" onClick={build} disabled={busy}>
          {busy ? <><span className="spinner" /> Bilgi haritası yapılandırılıyor…</> : <>Müfredatı oluştur</>}
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
        <span className="eyebrow">Taslak müfredat</span>
        <h1>{spec.title}</h1>
        <p className="text-2">{spec.goal}</p>
      </header>
      {draft.fallbackUsed && draft.error && <div className="banner warn">YZ sağlayıcısı başarısız oldu ({draft.error}). Bu taslak çevrimdışı oluşturucudan geliyor.</div>}
      <div className="banner info">{draft.note}</div>
      <div className="grid-2">
        <div className="card"><div className="eyebrow">Adımlar</div><div className="serif" style={{ fontSize: 28 }}>{all.length}</div><div className="small muted">≈ {minutes(total)} odaklı çalışma; adımlar bilerek farklı büyüklükte</div></div>
        <div className="card"><div className="eyebrow">Yapı</div><div className="small text-2" style={{ marginTop: 6 }}>{Object.entries(types).map(([t, n]) => `${n} ${TYPE_LABEL[t as keyof typeof TYPE_LABEL]?.toLocaleLowerCase("tr") ?? t}`).join(" · ")}</div></div>
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
                    <span className="grow">{m.title}{m.optional ? <span className="muted"> · isteğe bağlı</span> : null}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="row" style={{ position: "sticky", bottom: "calc(var(--nav-h) + 12px)" }}>
        <button className="btn" onClick={onBack} disabled={busy}>Geri</button>
        <button className="btn" onClick={onRegenerate} disabled={busy}>{busy ? <span className="spinner" /> : "Yeniden oluştur"}</button>
        <button className="btn primary grow" onClick={onAccept} disabled={busy}>Kabul et ve başlangıç noktamı bul</button>
      </div>
    </div>
  );
}
