"use client";

import { useActionState, useEffect, useState } from "react";
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

const statusOptions = ["Todo", "In-Progress", "Complete"] as const;

type TaskCardProps = {
  task: TaskView;
};

export function TaskCard({ task }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const editFormKey = `${task.id}-${task.updatedAt}`;
  const [editState, editAction] = useActionState(
    updateTaskAction,
    initialFormState,
  );
  const [archiveState, archiveAction] = useActionState(
    archiveTaskAction,
    initialFormState,
  );

  useEffect(() => {
    if (editState.status === "success") {
      setIsEditing(false);
    }
  }, [editState.status, task.updatedAt]);

  if (isEditing) {
    return (
      <li className="task-item task-item-editing">
        <form
          action={editAction}
          className="task-form inline-edit-form"
          key={editFormKey}
        >
          <input name="id" type="hidden" value={task.id} />

          <div className="task-main task-main-edit">
            <div className="edit-primary-fields">
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
                <span>Description</span>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={task.description}
                />
              </label>
            </div>

            <fieldset className="status-editor">
              <legend>Status</legend>
              {statusOptions.map((status) => (
                <label
                  className={`status-choice ${statusClassName(status)}`}
                  key={status}
                >
                  <input
                    defaultChecked={task.status === status}
                    name="status"
                    type="radio"
                    value={status}
                  />
                  <span>{status}</span>
                </label>
              ))}
            </fieldset>
          </div>

          <div className="task-meta edit-meta">
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

            <div className="state-preview">
              <span>State</span>
              <p>
                {task.isOverdue ? (
                  <span className="overdue">Overdue</span>
                ) : (
                  "On track"
                )}
              </p>
            </div>
          </div>

          <div className="form-footer edit-footer">
            <SubmitButton label="Save changes" pendingLabel="Saving..." />
            <button
              className="secondary-button"
              onClick={() => setIsEditing(false)}
              type="button"
            >
              Cancel
            </button>
            <FormMessage state={editState} />
          </div>
        </form>
      </li>
    );
  }

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
        <button
          className="secondary-button"
          onClick={() => setIsEditing(true)}
          type="button"
        >
          Edit
        </button>

        <form action={archiveAction} className="archive-action">
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
