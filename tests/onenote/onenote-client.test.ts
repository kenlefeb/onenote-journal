import {
  createMockContext,
  createMockNotebook,
  createMockSectionGroupForTest,
} from "../helpers/onenote-mock";
import {
  findOrCreateSectionGroup,
  findOrCreateSection,
  createPage,
} from "../../src/onenote/onenote-client";
import { OUTLINE_LEFT_POSITION, OUTLINE_TOP_POSITION } from "../../src/shared/constants";

// Cast mocks to the OneNote types since the mock structure matches the API shape
/* eslint-disable @typescript-eslint/no-explicit-any */
const asContext = (mock: ReturnType<typeof createMockContext>) => mock as any;
const asNotebook = (mock: ReturnType<typeof createMockNotebook>) => mock as any;
const asSectionGroup = (mock: ReturnType<typeof createMockSectionGroupForTest>) => mock as any;
/* eslint-enable @typescript-eslint/no-explicit-any */

describe("findOrCreateSectionGroup", () => {
  it("should return existing section group when found by name", async () => {
    const existingGroup = createMockSectionGroupForTest("03 March");
    const notebook = createMockNotebook("2026", [existingGroup]);
    const context = createMockContext();

    const result = await findOrCreateSectionGroup(asContext(context), asNotebook(notebook), "03 March");

    expect(result.name).toBe("03 March");
  });

  it("should create a new section group when not found", async () => {
    const notebook = createMockNotebook("2026");
    const context = createMockContext();

    const result = await findOrCreateSectionGroup(asContext(context), asNotebook(notebook), "03 March");

    expect(result.name).toBe("03 March");
  });

  it("should not create a duplicate when group already exists", async () => {
    const existingGroup = createMockSectionGroupForTest("03 March");
    const notebook = createMockNotebook("2026", [existingGroup]);
    const context = createMockContext();

    await findOrCreateSectionGroup(asContext(context), asNotebook(notebook), "03 March");

    expect(notebook.sectionGroups.items).toHaveLength(1);
  });
});

describe("findOrCreateSection", () => {
  it("should return existing section when found by name", async () => {
    const group = createMockSectionGroupForTest("03 March", ["03 Tuesday"]);
    const context = createMockContext();

    const result = await findOrCreateSection(asContext(context), asSectionGroup(group), "03 Tuesday");

    expect(result.name).toBe("03 Tuesday");
  });

  it("should create a new section when not found", async () => {
    const group = createMockSectionGroupForTest("03 March");
    const context = createMockContext();

    const result = await findOrCreateSection(asContext(context), asSectionGroup(group), "03 Tuesday");

    expect(result.name).toBe("03 Tuesday");
  });
});

describe("createPage", () => {
  it("should create a page with the given title", async () => {
    const group = createMockSectionGroupForTest("03 March", ["03 Tuesday"]);
    const section = group.sections.items[0];
    const context = createMockContext();

    await createPage(asContext(context), section as any, "2026-03-03 Tuesday", "<h2>Agenda</h2>");

    expect(section.pages).toHaveLength(1);
    expect(section.pages[0].title).toBe("2026-03-03 Tuesday");
  });

  it("should add an outline with the given HTML at the configured position", async () => {
    const group = createMockSectionGroupForTest("03 March", ["03 Tuesday"]);
    const section = group.sections.items[0];
    const context = createMockContext();

    await createPage(asContext(context), section as any, "2026-03-03 Tuesday", "<h2>Agenda</h2>");

    const page = section.pages[0];
    expect(page.outlines).toHaveLength(1);
    expect(page.outlines[0].html).toBe("<h2>Agenda</h2>");
    expect(page.outlines[0].left).toBe(OUTLINE_LEFT_POSITION);
    expect(page.outlines[0].top).toBe(OUTLINE_TOP_POSITION);
  });
});
