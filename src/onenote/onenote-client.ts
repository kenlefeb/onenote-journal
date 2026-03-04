import { OUTLINE_LEFT_POSITION, OUTLINE_TOP_POSITION } from "../shared/constants";

export async function findOrCreateSectionGroup(
  context: OneNote.RequestContext,
  notebook: OneNote.Notebook,
  name: string
): Promise<OneNote.SectionGroup> {
  const matches = notebook.sectionGroups.getByName(name);
  matches.load("items");
  await context.sync();

  if (matches.items.length > 0) {
    return matches.items[0];
  }

  const newGroup = notebook.addSectionGroup(name);
  await context.sync();
  return newGroup;
}

export async function findOrCreateSection(
  context: OneNote.RequestContext,
  sectionGroup: OneNote.SectionGroup,
  name: string
): Promise<OneNote.Section> {
  const matches = sectionGroup.sections.getByName(name);
  matches.load("items");
  await context.sync();

  if (matches.items.length > 0) {
    return matches.items[0];
  }

  const newSection = sectionGroup.addSection(name);
  await context.sync();
  return newSection;
}

export async function createPage(
  context: OneNote.RequestContext,
  section: OneNote.Section,
  title: string,
  html: string
): Promise<void> {
  const page = section.addPage(title);
  await context.sync();

  context.application.navigateToPage(page);
  await context.sync();

  page.addOutline(OUTLINE_LEFT_POSITION, OUTLINE_TOP_POSITION, html);
  await context.sync();
}
