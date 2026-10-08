import type { ReactNode } from "react";
import { useDB, useRoute } from "./state";
import { L, setLang } from "../i18n";
import { Icon, Toasts } from "./components/common";
import { HomePage } from "./pages/HomePage";
import { BuilderPage } from "./pages/BuilderPage";
import { CoursePage } from "./pages/CoursePage";
import { SessionPage } from "./pages/SessionPage";
import { SettingsPage } from "./pages/SettingsPage";
import { StatisticsPage } from "./pages/StatisticsPage";
import { FocusLabPage } from "./pages/FocusLabPage";
import { RetentionPage } from "./pages/RetentionPage";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { KnowledgePage } from "./pages/KnowledgePage";
import { StudyPage } from "./pages/StudyPage";
import { SummaryPage } from "./pages/SummaryPage";

const NAV = (): { path: string; label: string; icon: () => ReactNode; match: string[] }[] => [
  { path: "/", label: L("Home", "Ana sayfa"), icon: Icon.home, match: ["", "course", "build"] },
  { path: "/graph", label: L("Graph", "Grafik"), icon: Icon.atlas, match: ["graph"] },
  { path: "/study", label: L("Study", "Çalış"), icon: Icon.memory, match: ["study", "retention"] },
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
    case "study": page = <StudyPage />; break;
    case "retention": page = <RetentionPage />; break;
    case "summary": page = <SummaryPage sessionId={a} />; break;
    default: page = <HomePage />;
  }

  return (
    <div className={`app ${db.preferences.reduceMotion ? "reduce-motion" : ""}`}>
      <div className="ambient" aria-hidden><span /><span /></div>
      <main className={`main ${inSession ? "focus" : ""}`}>
        <ErrorBoundary key={route.join("/")}>{page}</ErrorBoundary>
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
    </div>
  );
}
