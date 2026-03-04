import { formatPageTitle, formatSectionName, formatSectionGroupName } from "./date-formatter";
import { buildDailyNoteHtml } from "./daily-note-template";
import { findOrCreateSectionGroup, findOrCreateSection, createPage } from "../onenote/onenote-client";

export async function createDailyNote(date: Date): Promise<string> {
  const pageTitle = formatPageTitle(date);
  const sectionGroupName = formatSectionGroupName(date);
  const sectionName = formatSectionName(date);
  const html = buildDailyNoteHtml({ date });

  await OneNote.run(async (context) => {
    const notebook = context.application.getActiveNotebook();

    const sectionGroup = await findOrCreateSectionGroup(context, notebook, sectionGroupName);
    const section = await findOrCreateSection(context, sectionGroup, sectionName);
    await createPage(context, section, pageTitle, html);
  });

  return pageTitle;
}

export async function createDailyNotes(dates: ReadonlyArray<Date>): Promise<ReadonlyArray<string>> {
  const titles: string[] = [];

  for (const date of dates) {
    const title = await createDailyNote(date);
    titles.push(title);
  }

  return titles;
}
