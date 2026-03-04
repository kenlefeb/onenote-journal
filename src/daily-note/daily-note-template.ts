import { formatPageTitle } from "./date-formatter";

interface DailyNoteTemplateOptions {
  readonly date: Date;
}

function buildAgendaSection(): string {
  return [
    "<h2>Agenda</h2>",
    "<table>",
    "  <tr>",
    "    <td><b>Start</b></td>",
    "    <td><b>End</b></td>",
    "    <td><b>Who</b></td>",
    "    <td><b>What</b></td>",
    "  </tr>",
    "</table>",
  ].join("\n");
}

function buildActionItemsSection(): string {
  return [
    "<h2>Action Items</h2>",
    "<ul>",
    "  <li></li>",
    "</ul>",
  ].join("\n");
}

function buildNotesSection(): string {
  return [
    "<h2>Notes</h2>",
    "<p></p>",
  ].join("\n");
}

export function buildDailyNoteTitle(date: Date): string {
  return formatPageTitle(date);
}

export function buildDailyNoteHtml(_options: DailyNoteTemplateOptions): string {
  return [
    buildAgendaSection(),
    buildActionItemsSection(),
    buildNotesSection(),
  ].join("\n");
}
