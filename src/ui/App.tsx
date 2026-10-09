import { lazy, Suspense, type ReactNode } from "react";
import { useDB, useRoute } from "./state";
import { L, setLang } from "../i18n";
import { Icon, Toasts } from "./components/common";
import { HomePage } from "./pages/HomePage";
import { CoursePage } from "./pages/CoursePage";
import { SessionPage } from "./pages/SessionPage";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { CommandPalette } from "./components/CommandPalette";

// Screens other than Home and the session load on demand, so Lab opens fast.
const BuilderPage = lazy(() => import("./pages/BuilderPage").then((m) => ({ default: m.BuilderPage })));
const SettingsPage = lazy(() => import("./pages/SettingsPage").then((m) => ({ default: m.SettingsPage })));
const StatisticsPage = lazy(() => import("./pages/StatisticsPage").then((m) => ({ default: m.StatisticsPage })));
const FocusLabPage = lazy(() => import("./pages/FocusLabPage").then((m) => ({ default: m.FocusLabPage })));
const RetentionPage = lazy(() => import("./pages/RetentionPage").then((m) => ({ default: m.RetentionPage })));
const KnowledgePage = lazy(() => import("./pages/KnowledgePage").then((m) => ({ default: m.KnowledgePage })));
const StudyPage = lazy(() => import("./pages/StudyPage").then((m) => ({ default: m.StudyPage })));
const SummaryPage = lazy(() => import("./pages/SummaryPage").then((m) => ({ default: m.SummaryPage })));
const WorkPage = lazy(() => import("./pages/WorkPage").then((m) => ({ default: m.WorkPage })));

const NAV = (): { path: string; label: string; icon: () => ReactNode; match: string[] }[] => [
  { path: "/", label: L("Home", "Ana sayfa"), icon: Icon.home, match: ["", "course", "build"] },
  { path: "/graph", label: L("Graph", "Grafik"), icon: Icon.atlas, match: ["graph"] },
  { path: "/study", label: L("Study", "Çalış"), icon: Icon.memory, match: ["study", "retention"] },
  { path: "/work", label: L("Work", "Çalışmalar"), icon: Icon.desk, match: ["work"] },
  { path: "/stats", label: L("Stats", "İstatistik"), icon: Icon.stats, match: ["stats", "focus"] },
  { path: "/settings", label: L("Settings", "Ayarlar"), icon: Icon.gear, match: ["settings"] },
];

export function App() {
  const route = useRoute();
  const db = useDB();
  setLang(db.preferences.language);
  const [head, a] = route;
  const inSession = head === "session" || head === "summary";

  let page: ReactNode;
  switch (head) {
    case undefined: page = <HomePage />; break;
    case "build": page = <BuilderPage />; break;
    case "course": page = <CoursePage key={a} courseId={a} />; break;
    case "session": page = <SessionPage key={a} milestoneId={a} />; break;
    case "settings": page = <SettingsPage />; break;
    case "stats": page = <StatisticsPage />; break;
    case "focus": page = <FocusLabPage />; break;
    case "graph": page = <KnowledgePage key={window.location.hash} />; break;
    case "study": page = <StudyPage key={window.location.hash} />; break;
    case "retention": page = <RetentionPage />; break;
    case "summary": page = <SummaryPage sessionId={a} />; break;
    case "work": page = <WorkPage key={window.location.hash} />; break;
    default: page = <HomePage />;
  }

  return (
    <div className={`app ${db.preferences.reduceMotion || db.preferences.animation !== "full" ? "reduce-motion" : ""} ${db.preferences.animation === "off" ? "no-motion" : ""} ${inSession && db.preferences.deepWork ? "deep-work" : ""}`}>
      <div className="ambient" aria-hidden><span /><span /></div>
      <main className={`main ${inSession ? "focus" : ""}`}>
        <ErrorBoundary key={route.join("/")}><Suspense fallback={<div className="skeleton" style={{ height: 240 }} aria-label={L("Loading", "Yükleniyor")} />}>{page}</Suspense></ErrorBoundary>
      </main>
      {!inSession && (
        <nav className="nav" aria-label={L("Main menu", "Ana menü")}>
          <div className="nav-inner">
            {NAV().map((n) => (
              <a key={n.path} href={`#${n.path}`} className={n.match.includes(head ?? "") ? "active" : ""} aria-current={n.match.includes(head ?? "") ? "page" : undefined}>
                <n.icon />
                <span>{n.label}</span>
              </a>
            ))}
          </div>
        </nav>
      )}
      <Toasts />
      <CommandPalette />
    </div>
  );
}
