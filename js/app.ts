export {};

import { addTask, columnView } from "./board.js";
import { relativeDueDate } from "./format.js";
import { loadOrCreateBoard, saveBoard } from "./storage.js";
import { BELL_ICON } from "./theme.js";

async function main() {
  const board = await loadOrCreateBoard();
  render(board);

  const form = document.querySelector("#task-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form as HTMLFormElement);

    try {
      const updated = addTask(board, {
        title: formData.get("title"),
        notes: formData.get("notes"),
        priority: formData.get("priority"),
        dueDate:
          formData.get("dueDate") !== null
            ? new Date(formData.get("dueDate")).toISOString()
            : undefined,
        columnId: board.columns[0].id,
      });
      saveBoard(updated);
      render(updated);
      form.reset();
    } catch (err) {
      showError(err instanceof Error ? err.message : String(err));
    }
  });
}

function render(board: any) {
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

function showError(message: string) {
  const el = document.querySelector("#error");
  if (el) el.textContent = message;
}

main();