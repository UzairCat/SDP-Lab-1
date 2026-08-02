"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  archiveTaskAction,
  type TaskFormState,
  updateTaskAction,
} from "../../src/tasks/actions";
import type { TaskView } from "../../src/tasks/service";

const initialFormState: TaskFormState = {
  status: "idle",
  message: "",
};

type TaskCardProps = {
  task: TaskView;
};

export function TaskCard({ task }: TaskCardProps) {
  const editFormKey = `${task.id}-${task.updatedAt}`;
  const [editState, editAction] = useActionState(
    updateTaskAction,
    initialFormState,
  );
  const [archiveState, archiveAction] = useActionState(
    archiveTaskAction,
    initialFormState,
  );

  return (
    <li className="task-item">
      <div className="task-main">
        <div>
          <h3>{task.title}</h3>
          <p>{task.description || "No description provided."}</p>
        </div>
        <span className={`status ${statusClassName(task.status)}`}>
          {task.status}
        </span>
      </div>

      <dl className="task-meta">
        <div>
          <dt>Topic</dt>
          <dd>{task.topic}</dd>
        </div>
        <div>
          <dt>Due</dt>
          <dd>{formatDueDate(task.dueDate)}</dd>
        </div>
        <div>
          <dt>State</dt>
          <dd>
            {task.isOverdue ? (
              <span className="overdue">Overdue</span>
            ) : (
              "On track"
            )}
          </dd>
        </div>
      </dl>

      <div className="task-actions">
        <details className="edit-task">
          <summary>Edit</summary>
          <form
            action={editAction}
            className="task-form compact-form"
            key={editFormKey}
          >
            <input name="id" type="hidden" value={task.id} />
            <div className="form-grid">
              <label className="field">
                <span>Title</span>
                <input
                  name="title"
                  required
                  maxLength={120}
                  defaultValue={task.title}
                />
              </label>

              <label className="field">
                <span>Topic</span>
                <input
                  name="topic"
                  required
                  maxLength={80}
                  defaultValue={task.topic}
                />
              </label>

              <label className="field">
                <span>Due date</span>
                <input
                  name="dueDate"
                  type="date"
                  required
                  defaultValue={task.dueDate}
                />
              </label>

              <label className="field">
                <span>Status</span>
                <select name="status" defaultValue={task.status}>
                  <option value="Todo">Todo</option>
                  <option value="In-Progress">In-Progress</option>
                  <option value="Complete">Complete</option>
                </select>
              </label>
            </div>

            <label className="field">
              <span>Description</span>
              <textarea
                name="description"
                rows={3}
                defaultValue={task.description}
              />
            </label>

            <div className="form-footer">
              <SubmitButton label="Save changes" pendingLabel="Saving..." />
              <FormMessage state={editState} />
            </div>
          </form>
        </details>

        <form action={archiveAction}>
          <input name="id" type="hidden" value={task.id} />
          <ArchiveButton />
          <FormMessage state={archiveState} />
        </form>
      </div>
    </li>
  );
}

export function ArchivedTaskCard({ task }: TaskCardProps) {
  return (
    <li className="task-item archived-task">
      <div className="task-main">
        <div>
          <h3>{task.title}</h3>
          <p>{task.description || "No description provided."}</p>
        </div>
        <span className={`status ${statusClassName(task.status)}`}>
          {task.status}
        </span>
      </div>

      <dl className="task-meta">
        <div>
          <dt>Topic</dt>
          <dd>{task.topic}</dd>
        </div>
        <div>
          <dt>Due</dt>
          <dd>{formatDueDate(task.dueDate)}</dd>
        </div>
        <div>
          <dt>Archived</dt>
          <dd>
            {task.archivedAt ? formatTimestamp(task.archivedAt) : "Unknown"}
          </dd>
        </div>
      </dl>
    </li>
  );
}

function SubmitButton({
  label,
  pendingLabel,
}: {
  label: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button className="primary-button" type="submit" disabled={pending}>
      {pending ? pendingLabel : label}
    </button>
  );
}

function ArchiveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="secondary-button danger-button"
      type="submit"
      disabled={pending}
    >
      {pending ? "Archiving..." : "Archive"}
    </button>
  );
}

function FormMessage({ state }: { state: TaskFormState }) {
  return state.message ? (
    <p className={`form-message ${state.status}`}>{state.message}</p>
  ) : null;
}

function statusClassName(status: string) {
  return status.toLowerCase().replace(/[^a-z]+/g, "-");
}

function formatDueDate(dueDate: string) {
  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${dueDate}T00:00:00`));
}

function formatTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}
