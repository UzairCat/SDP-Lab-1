"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import {
  createTaskAction,
  initialTaskFormState,
} from "../../src/tasks/actions";

export function CreateTaskForm() {
  const [state, formAction] = useActionState(
    createTaskAction,
    initialTaskFormState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className="task-form">
      <div className="form-grid">
        <label className="field">
          <span>Title</span>
          <input name="title" required maxLength={120} />
        </label>

        <label className="field">
          <span>Topic</span>
          <input name="topic" required maxLength={80} />
        </label>

        <label className="field">
          <span>Due date</span>
          <input name="dueDate" type="date" required />
        </label>

        <label className="field">
          <span>Status</span>
          <select name="status" defaultValue="Todo">
            <option value="Todo">Todo</option>
            <option value="In-Progress">In-Progress</option>
            <option value="Complete">Complete</option>
          </select>
        </label>
      </div>

      <label className="field">
        <span>Description</span>
        <textarea name="description" rows={4} />
      </label>

      <div className="form-footer">
        <SubmitButton />
        {state.message ? (
          <p className={`form-message ${state.status}`}>{state.message}</p>
        ) : null}
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="primary-button" type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create task"}
    </button>
  );
}
