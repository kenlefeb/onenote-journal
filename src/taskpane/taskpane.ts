import "./taskpane.css";
import { createDailyNotes } from "../daily-note/daily-note-service";
import { extractErrorMessage } from "../shared/error-handler";

const selectedDates: Date[] = [];

function getElement(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element with id "${id}" not found`);
  }
  return element;
}

function formatDateForDisplay(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function todayAsInputValue(): string {
  return formatDateForDisplay(new Date());
}

function setStatus(message: string, type: "success" | "error" | "info"): void {
  const status = getElement("status");
  status.textContent = message;
  status.className = `status-area ${type}`;
}

function clearStatus(): void {
  const status = getElement("status");
  status.textContent = "";
  status.className = "status-area";
}

function updateCreateButtonState(): void {
  const button = getElement("create-button") as HTMLButtonElement;
  button.disabled = selectedDates.length === 0;
}

function renderSelectedDates(): void {
  const list = getElement("selected-dates-list");
  list.innerHTML = "";

  for (let i = 0; i < selectedDates.length; i++) {
    const date = selectedDates[i];
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = formatDateForDisplay(date);

    const removeButton = document.createElement("button");
    removeButton.className = "remove-date-button";
    removeButton.textContent = "\u00D7";
    removeButton.title = "Remove date";
    removeButton.addEventListener("click", () => {
      selectedDates.splice(i, 1);
      renderSelectedDates();
      updateCreateButtonState();
    });

    li.appendChild(span);
    li.appendChild(removeButton);
    list.appendChild(li);
  }

  updateCreateButtonState();
}

function addDate(): void {
  const input = getElement("date-input") as HTMLInputElement;
  const dateValue = input.value;

  if (!dateValue) {
    setStatus("Please select a date.", "error");
    return;
  }

  const parts = dateValue.split("-");
  const date = new Date(
    parseInt(parts[0], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[2], 10)
  );

  const isDuplicate = selectedDates.some(
    (d) => formatDateForDisplay(d) === formatDateForDisplay(date)
  );

  if (isDuplicate) {
    setStatus("Date already selected.", "error");
    return;
  }

  clearStatus();
  selectedDates.push(date);
  renderSelectedDates();
}

async function handleCreate(): Promise<void> {
  if (selectedDates.length === 0) {
    return;
  }

  const button = getElement("create-button") as HTMLButtonElement;
  button.disabled = true;

  try {
    setStatus(`Creating ${selectedDates.length} daily note(s)...`, "info");
    const titles = await createDailyNotes(selectedDates);
    setStatus(`Created: ${titles.join(", ")}`, "success");
    selectedDates.length = 0;
    renderSelectedDates();
  } catch (error: unknown) {
    setStatus(`Error: ${extractErrorMessage(error)}`, "error");
  } finally {
    updateCreateButtonState();
  }
}

Office.onReady((info) => {
  if (info.host === Office.HostType.OneNote) {
    const dateInput = getElement("date-input") as HTMLInputElement;
    dateInput.value = todayAsInputValue();

    getElement("add-date-button").addEventListener("click", addDate);
    getElement("create-button").addEventListener("click", handleCreate);
  }
});
