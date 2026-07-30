import Link from "next/link";
import type { TaskSort } from "../../src/tasks/service";

const sortOptions: Array<{ label: string; value: TaskSort }> = [
  { label: "Due date", value: "dueDate" },
  { label: "Topic", value: "topic" },
  { label: "Status", value: "status" },
];

type SortControlsProps = {
  activeSort: TaskSort;
};

export function SortControls({ activeSort }: SortControlsProps) {
  return (
    <nav className="sort-controls" aria-label="Sort active tasks">
      {sortOptions.map((option) => (
        <Link
          aria-current={option.value === activeSort ? "page" : undefined}
          className="sort-link"
          href={`/?sort=${option.value}`}
          key={option.value}
        >
          {option.label}
        </Link>
      ))}
    </nav>
  );
}
