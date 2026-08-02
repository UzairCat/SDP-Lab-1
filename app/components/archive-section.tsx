"use client";

import { useState } from "react";
import { ArchivedTaskCard } from "./task-card";
import type { TaskView } from "../../src/tasks/service";

type ArchiveSectionProps = {
  tasks: TaskView[];
};

export function ArchiveSection({ tasks }: ArchiveSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const archiveListId = "archived-task-list";

  return (
    <section className="panel archive-panel" aria-labelledby="archived-tasks-title">
      <div className="section-heading archive-heading">
        <div>
          <h2 id="archived-tasks-title">Archived Tasks</h2>
          <span>{tasks.length} total</span>
        </div>
        <button
          aria-controls={archiveListId}
          aria-expanded={isOpen}
          className="secondary-button archive-toggle"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          {isOpen ? "Hide Archived Tasks" : "View Archived Tasks"}
        </button>
      </div>

      {isOpen ? (
        tasks.length > 0 ? (
          <ul className="task-list archive-list" id={archiveListId}>
            {tasks.map((task) => (
              <ArchivedTaskCard key={task.id} task={task} />
            ))}
          </ul>
        ) : (
          <p className="empty-state" id={archiveListId}>
            No archived tasks yet.
          </p>
        )
      ) : null}
    </section>
  );
}
