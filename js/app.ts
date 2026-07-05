import { addTask, columnView } from "./board.js";
import { relativeDueDate } from "./format.js";
import { loadOrCreateBoard, saveBoard } from "./storage.js";
import { BELL_ICON } from "./theme.js";

async function main() {
  const board = await loadOrCreateBoard();
  render(board);

  const form = document.querySelector("#task-form") as HTMLFormElement;
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    try {
      const updated = addTask(board, {
        title: formData.get("title"),
        notes: formData.get("notes"),
        priority: formData.get("priority"),
        dueDate: formData.get("dueDate")
          ? new Date(formData.get("dueDate")).toISOString()
          : undefined,
        columnId: board.columns[0].id,
      });
      saveBoard(updated);
      render(updated);
      form.reset();
    } catch (err) {
      // err is unknown; cast to any for message access (original used err.message)
      showError((err as any).message);
    }
  });
}

function render(board) {
  const root = document.querySelector("#board");
  if (!root) return;

  root.innerHTML = board.columns
    .map((column) => {
      const tasks = columnView(board, column.id);
      return `
        <section class="column">
          <h2><img class="col-icon" src="${BELL_ICON}" alt="" />${column.name}</h2>
          <ul>
            ${tasks
              .map(
                (task) => `
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

function showError(message) {
  const el = document.querySelector("#error");
  if (el) el.textContent = message;
}

main();

export {};