import {
  buildDailyNoteTitle,
  buildDailyNoteHtml,
} from "../../src/daily-note/daily-note-template";

describe("buildDailyNoteTitle", () => {
  it("should format title as 'YYYY-MM-DD Dddd'", () => {
    const date = new Date(2026, 2, 3);
    expect(buildDailyNoteTitle(date)).toBe("2026-03-03 Tuesday");
  });
});

describe("buildDailyNoteHtml", () => {
  const date = new Date(2026, 2, 3);
  let html: string;

  beforeEach(() => {
    html = buildDailyNoteHtml({ date });
  });

  it("should contain an Agenda heading", () => {
    expect(html).toContain("<h2>Agenda</h2>");
  });

  it("should contain an Action Items heading", () => {
    expect(html).toContain("<h2>Action Items</h2>");
  });

  it("should contain a Notes heading", () => {
    expect(html).toContain("<h2>Notes</h2>");
  });

  it("should contain an Agenda table with correct headers", () => {
    expect(html).toContain("<table>");
    expect(html).toContain("<b>Start</b>");
    expect(html).toContain("<b>End</b>");
    expect(html).toContain("<b>Who</b>");
    expect(html).toContain("<b>What</b>");
  });

  it("should contain an Action Items list", () => {
    expect(html).toContain("<ul>");
    expect(html).toContain("<li>");
  });

  it("should place sections in order: Agenda, Action Items, Notes", () => {
    const agendaIndex = html.indexOf("<h2>Agenda</h2>");
    const actionItemsIndex = html.indexOf("<h2>Action Items</h2>");
    const notesIndex = html.indexOf("<h2>Notes</h2>");

    expect(agendaIndex).toBeLessThan(actionItemsIndex);
    expect(actionItemsIndex).toBeLessThan(notesIndex);
  });
});
