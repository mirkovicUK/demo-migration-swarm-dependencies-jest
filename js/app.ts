// js/app.ts — DOM wiring / entry module (→ board, format, storage)

import { addTask, columnView } from "./board.js";
import { relativeDueDate } from "./format.js";
import { loadOrCreateBoard, saveBoard } from "./storage.js";
import { BELL_ICON } from "./theme.js";

export async function main(): Promise<void> {
  const board = await loadOrCreateBoard();
  render(board);

  const form = document.querySelector<HTMLFormElement>("#task-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    try {
      const updated = addTask(board, {
        title: formData.get("title") as string,
        notes: formData.get("notes") as string | null,
        priority: formData.get("priority") as string,
        dueDate:
          formData.get("dueDate") !== null
            ? new Date(formData.get("dueDate") as string).toISOString()
            : undefined,
        columnId: board.columns[0].id,
      });
      saveBoard(updated);
      render(updated);
      form.reset();
    } catch (err) {
      if (err instanceof Error) {
        showError(err.message);
      } else {
        showError(String(err));
      }
    }
  });
}

export function render(board: any): void {
  const root = document.querySelector("#board");
  if (!root) return;

  root.innerHTML = board.columns
    .map((column: any) => {
      const tasks = columnView(board, column.id);
      return `
        <section class="column">
          <h2><img class="col-icon" src="${BELL_ICON}" alt="" />${column.name}</h2>
          <ul>
            ${tasks
              .map(
                (task: any) => `
              <li class="task priority-${task.priority}">
                <strong>${task.title}</strong>
                <span class="due ${task.dueDateStatus}">${task.dueDateLabel}</span>
                ${task.dueDate ? `<small>${relativeDueDate(task.dueDate)}</small>` : ""}
              </li>`
              )
              .join("")}
          </ul>
        </section>`;
    })
    .join("");
}

export function showError(message: string): void {
  const el = document.querySelector("#error");
  if (el) el.textContent = message;
}

main();