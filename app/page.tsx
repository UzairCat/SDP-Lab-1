import { CreateTaskForm } from "./components/create-task-form";
import { listActiveTasks } from "../src/tasks/service";

export const dynamic = "force-dynamic";

export default function Home() {
  const tasks = listActiveTasks({ sortBy: "dueDate" });
  const overdueCount = tasks.filter((task) => task.isOverdue).length;

  return (
    <main className="shell">
      <section className="page-header" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">COMS3011A Lab 1</p>
          <h1 id="page-title">Local Todo</h1>
          <p className="lede">
            Create tasks with a topic and due date, then track their current
            status from one local SQLite database.
          </p>
        </div>
        <dl className="summary">
          <div>
            <dt>Active</dt>
            <dd>{tasks.length}</dd>
          </div>
          <div>
            <dt>Overdue</dt>
            <dd>{overdueCount}</dd>
          </div>
        </dl>
      </section>

      <section className="workspace" aria-label="Task workspace">
        <section className="panel" aria-labelledby="create-task-title">
          <div className="section-heading">
            <h2 id="create-task-title">Create Task</h2>
          </div>
          <CreateTaskForm />
        </section>

        <section className="panel" aria-labelledby="active-tasks-title">
          <div className="section-heading">
            <h2 id="active-tasks-title">Active Tasks</h2>
            <span>{tasks.length} total</span>
          </div>

          {tasks.length > 0 ? (
            <ul className="task-list">
              {tasks.map((task) => (
                <li className="task-item" key={task.id}>
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
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">No active tasks yet.</p>
          )}
        </section>
      </section>
    </main>
  );
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
