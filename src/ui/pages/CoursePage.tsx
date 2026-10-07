import { useEffect, useState } from "react";
import type { ID } from "../../domain/types";
import { courseMilestones } from "../../engines/curriculum";
import { navigate, useDB } from "../state";
import { Bar, Empty, Icon } from "../components/common";
import { NextOptions } from "../components/NextOptions";
import { CurriculumEditor } from "./CurriculumEditor";
import { CalibrationSheet } from "./CalibrationSheet";
import { ProgressionMap } from "../components/ProgressionMap";
import { AdvisorPanel } from "../components/AdvisorPanel";
import { L } from "../../i18n";

type Tab = "next" | "map" | "edit";

export function courseProgress(db: ReturnType<typeof useDB>, courseId: ID) {
  const ms = courseMilestones(db, courseId);
  const required = ms.filter((m) => m.required);
  const done = (m: (typeof ms)[number]) => m.status === "MASTERED" || m.status === "NEEDS_REVIEW";
  return {
    total: ms.length,
    mastered: ms.filter(done).length,
    requiredTotal: required.length,
    requiredMastered: required.filter(done).length,
    skipped: ms.filter((m) => m.status === "SKIPPED").length,
    review: ms.filter((m) => m.status === "NEEDS_REVIEW").length,
  };
}

export function CoursePage({ courseId }: { courseId: ID }) {
  const db = useDB();
  const course = db.courses[courseId];
  const query = new URLSearchParams(window.location.hash.split("?")[1] ?? "");
  const [tab, setTab] = useState<Tab>((query.get("tab") as Tab) || "next");
  const [calibrate, setCalibrate] = useState(query.get("calibrate") === "1");

  useEffect(() => {
    if (query.get("calibrate") === "1") navigate(`/course/${courseId}`);
  }, []); // run once: strip the one-shot query flag

  if (!course) return <Empty title={L("Course not found", "Ders bulunamadı")}><button className="btn" onClick={() => navigate("/")}>{L("Home", "Ana sayfa")}</button></Empty>;
  const p = courseProgress(db, courseId);
  const start = course.startHereMilestoneId ? db.milestones[course.startHereMilestoneId] : undefined;
  const open = (id: ID) => navigate(`/session/${id}`);

  return (
    <div className="stack-lg rise">
      <header className="stack" style={{ gap: 8 }}>
        <button className="btn ghost small" style={{ alignSelf: "flex-start" }} onClick={() => navigate("/")}><Icon.back /> {L("Home", "Ana sayfa")}</button>
        <span className="eyebrow">{db.subjects[course.subjectId]?.name}</span>
        <h1>{course.title}</h1>
        <p className="text-2">{course.goal}</p>
        <div className="stack" style={{ gap: 6, marginTop: 6 }}>
          <Bar value={p.requiredTotal ? p.requiredMastered / p.requiredTotal : 0} mastered />
          <div className="row small muted" style={{ gap: 14 }}>
            <span><strong style={{ color: "var(--text)" }}>{p.requiredMastered}</strong> / {p.requiredTotal} {L("core milestones mastered", "temel adımda ustalaşıldı")}</span>
            {p.total > p.requiredTotal && <span>{p.total - p.requiredTotal} {L("optional", "isteğe bağlı")}</span>}
            {p.review > 0 && <span style={{ color: "var(--review)" }}>{p.review} {L("need review", "tekrar bekliyor")}</span>}
            {p.skipped > 0 && <span>{p.skipped} {L("skipped", "atlandı")}</span>}
          </div>
        </div>
      </header>

      <div className="tabs" role="tablist">
        {(["next", "map", "edit"] as Tab[]).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>
            {t === "next" ? L("What's next", "Sırada ne var") : t === "map" ? L("Map", "Harita") : L("Curriculum", "Müfredat")}
          </button>
        ))}
      </div>

      {tab === "next" && (
        <div className="stack">
          {start && start.status !== "MASTERED" && !courseMilestones(db, courseId).some((m) => m.masteredAt) && (
            <div className="banner info row between">
              <span>{L("Start here: ", "Buradan başla: ")}<strong>{start.title}</strong></span>
              <button className="btn small" onClick={() => open(start.id)}>{L("Open", "Aç")}</button>
            </div>
          )}
          <NextOptions courseId={courseId} onChoose={open} />
          <AdvisorPanel courseId={courseId} />
          <button className="btn ghost small" style={{ alignSelf: "flex-start" }} onClick={() => setCalibrate(true)}>{L("Recalibrate my starting point", "Başlangıç noktamı yeniden belirle")}</button>
        </div>
      )}
      {tab === "map" && <ProgressionMap courseId={courseId} onOpen={open} />}
      {tab === "edit" && <CurriculumEditor courseId={courseId} />}
      {calibrate && <CalibrationSheet courseId={courseId} onClose={() => setCalibrate(false)} />}
    </div>
  );
}
