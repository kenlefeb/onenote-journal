import {
  formatPageTitle,
  formatSectionName,
  formatSectionGroupName,
  formatNotebookName,
} from "../../src/daily-note/date-formatter";

describe("formatPageTitle", () => {
  it("should format as 'YYYY-MM-DD Dddd'", () => {
    const date = new Date(2026, 2, 3); // March 3, 2026 (Tuesday)
    expect(formatPageTitle(date)).toBe("2026-03-03 Tuesday");
  });

  it("should zero-pad single-digit months and days", () => {
    const date = new Date(2026, 0, 5); // January 5, 2026 (Monday)
    expect(formatPageTitle(date)).toBe("2026-01-05 Monday");
  });

  it("should handle end of year", () => {
    const date = new Date(2026, 11, 31); // December 31, 2026 (Thursday)
    expect(formatPageTitle(date)).toBe("2026-12-31 Thursday");
  });
});

describe("formatSectionName", () => {
  it("should format as 'DD Dddd'", () => {
    const date = new Date(2026, 2, 3); // Tuesday
    expect(formatSectionName(date)).toBe("03 Tuesday");
  });

  it("should zero-pad single-digit days", () => {
    const date = new Date(2026, 0, 5); // Monday
    expect(formatSectionName(date)).toBe("05 Monday");
  });

  it("should handle double-digit days", () => {
    const date = new Date(2026, 2, 15); // Sunday
    expect(formatSectionName(date)).toBe("15 Sunday");
  });
});

describe("formatSectionGroupName", () => {
  it("should format as 'MM Mmmm'", () => {
    const date = new Date(2026, 2, 3); // March
    expect(formatSectionGroupName(date)).toBe("03 March");
  });

  it("should zero-pad single-digit months", () => {
    const date = new Date(2026, 0, 5); // January
    expect(formatSectionGroupName(date)).toBe("01 January");
  });

  it("should handle December", () => {
    const date = new Date(2026, 11, 31); // December
    expect(formatSectionGroupName(date)).toBe("12 December");
  });
});

describe("formatNotebookName", () => {
  it("should return the four-digit year", () => {
    const date = new Date(2026, 2, 3);
    expect(formatNotebookName(date)).toBe("2026");
  });

  it("should handle different years", () => {
    const date = new Date(2027, 5, 15);
    expect(formatNotebookName(date)).toBe("2027");
  });
});
