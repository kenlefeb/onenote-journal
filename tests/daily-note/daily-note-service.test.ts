import { createMockNotebook, createMockContext } from "../helpers/onenote-mock";

// Mock the global OneNote object before importing the service
const mockNotebook = createMockNotebook("2026");
const mockContext = {
  ...createMockContext(),
  application: {
    getActiveNotebook: () => mockNotebook,
    navigateToPage: () => {
      // no-op in mock
    },
  },
};

(global as Record<string, unknown>).OneNote = {
  run: async (callback: (context: typeof mockContext) => Promise<void>) => {
    await callback(mockContext);
  },
};

import { createDailyNote, createDailyNotes } from "../../src/daily-note/daily-note-service";

describe("createDailyNote", () => {
  it("should return the formatted page title", async () => {
    const date = new Date(2026, 2, 3); // March 3, 2026 (Tuesday)
    const title = await createDailyNote(date);
    expect(title).toBe("2026-03-03 Tuesday");
  });

  it("should create section group with month name", async () => {
    const date = new Date(2026, 2, 3);
    await createDailyNote(date);

    const groups = mockNotebook.sectionGroups.items;
    const marchGroup = groups.find((g) => g.name === "03 March");
    expect(marchGroup).toBeDefined();
  });

  it("should create section with day name inside the section group", async () => {
    const date = new Date(2026, 2, 3);
    await createDailyNote(date);

    const marchGroup = mockNotebook.sectionGroups.items.find((g) => g.name === "03 March");
    const sections = marchGroup?.sections.items ?? [];
    const tuesdaySection = sections.find((s) => s.name === "03 Tuesday");
    expect(tuesdaySection).toBeDefined();
  });
});

describe("createDailyNotes", () => {
  it("should create notes for multiple dates and return all titles", async () => {
    const dates = [
      new Date(2026, 2, 3), // Tuesday
      new Date(2026, 2, 4), // Wednesday
    ];

    const titles = await createDailyNotes(dates);

    expect(titles).toEqual(["2026-03-03 Tuesday", "2026-03-04 Wednesday"]);
  });
});
