import { CreateTaskForm } from "./components/create-task-form";
import { SortControls } from "./components/sort-controls";
import { ArchivedTaskCard, TaskCard } from "./components/task-card";
import {
  listActiveTasks,
  listArchivedTasks,
  type TaskSort,
} from "../src/tasks/service";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: HomeProps) {
  const activeSort = getSortValue((await searchParams)?.sort);
  const tasks = listActiveTasks({ sortBy: activeSort });
  const archivedTasks = listArchivedTasks({
    sortBy: "dueDate",
    sortDirection: "desc",
  });
  const overdueCount = tasks.filter((task) => task.isOverdue).length;

  return (
    <main className="shell">
      <section className="page-header" aria-labelledby="page-title">
        <div>
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
          <div>
            <dt>Archived</dt>
            <dd>{archivedTasks.length}</dd>
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
          <SortControls activeSort={activeSort} />

          {tasks.length > 0 ? (
            <ul className="task-list">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </ul>
          ) : (
            <p className="empty-state">No active tasks yet.</p>
          )}
        </section>

        <section
          className="panel archive-panel"
          aria-labelledby="archived-tasks-title"
        >
          <div className="section-heading">
            <h2 id="archived-tasks-title">Archived Tasks</h2>
            <span>{archivedTasks.length} total</span>
          </div>

          {archivedTasks.length > 0 ? (
            <ul className="task-list">
              {archivedTasks.map((task) => (
                <ArchivedTaskCard key={task.id} task={task} />
              ))}
            </ul>
          ) : (
            <p className="empty-state">No archived tasks yet.</p>
          )}
        </section>
      </section>
    </main>
  );
}

function getSortValue(value: string | string[] | undefined): TaskSort {
  const sort = Array.isArray(value) ? value[0] : value;

  if (sort === "topic" || sort === "status" || sort === "dueDate") {
    return sort;
  }

  return "dueDate";
}
