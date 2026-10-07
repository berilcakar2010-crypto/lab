import type { ID } from "../../domain/types";
import { orderedMilestones } from "../../engines/curriculum";
import { useDB } from "../state";
import { StatusChip } from "./common";

/** Temporary list view; replaced by the graph map in Phase 5. */
export function ProgressionMap({ courseId, onOpen }: { courseId: ID; onOpen: (id: ID) => void }) {
  const db = useDB();
  return (
    <div className="card list">
      {orderedMilestones(db, courseId).map((m) => (
        <button key={m.id} className="list-item" style={{ background: "none", border: 0, color: "inherit", textAlign: "left" }} onClick={() => onOpen(m.id)}>
          <span className="grow">{m.title}</span><StatusChip status={m.status} />
        </button>
      ))}
    </div>
  );
}
