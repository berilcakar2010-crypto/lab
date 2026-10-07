import { Empty } from "../components/common";

/** Session summary — implemented in Phase 10. */
export function SummaryPage(_props: { sessionId: string }) {
  return <Empty title="Session saved"><a className="btn" href="#/">Home</a></Empty>;
}
