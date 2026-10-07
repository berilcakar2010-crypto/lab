import { useDB, navigate } from "../state";
import { Bar, Icon } from "../components/common";
import { courseProgress } from "./CoursePage";

export function HomePage() {
  const db = useDB();
  const courses = Object.values(db.courses).filter((c) => !c.archived).sort((a, b) => b.createdAt - a.createdAt);
  return (
    <div className="stack-lg rise">
      <header className="stack" style={{ gap: 4 }}>
        <span className="eyebrow">Lab</span>
        <h1>What's next?</h1>
      </header>
      {!courses.length && (
        <div className="card stack">
          <h2>Start with a big goal</h2>
          <p className="text-2">Name a course or paste a syllabus. Lab turns it into the next meaningful thing you can actually do.</p>
          <button className="btn primary" onClick={() => navigate("/build")}><Icon.plus /> New course</button>
        </div>
      )}
      <div className="stack">
        {courses.map((c) => {
          const p = courseProgress(db, c.id);
          return (
            <button key={c.id} className="card clickable stack" style={{ textAlign: "left", color: "inherit", font: "inherit", gap: 8 }} onClick={() => navigate(`/course/${c.id}`)}>
              <span className="eyebrow">{db.subjects[c.subjectId]?.name}</span>
              <h2>{c.title}</h2>
              <Bar value={p.requiredTotal ? p.requiredMastered / p.requiredTotal : 0} mastered />
              <span className="small muted">{p.requiredMastered} / {p.requiredTotal} core milestones</span>
            </button>
          );
        })}
      </div>
      {courses.length > 0 && <button className="btn" onClick={() => navigate("/build")}><Icon.plus /> New course</button>}
    </div>
  );
}
