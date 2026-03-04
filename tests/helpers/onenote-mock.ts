interface MockSectionGroup {
  name: string;
  sections: MockSectionCollection;
  addSection: (name: string) => MockSection;
  addSectionGroup: (name: string) => MockSectionGroup;
  sectionGroups: MockSectionGroupCollection;
}

interface MockSection {
  name: string;
  pages: MockPage[];
  addPage: (title: string) => MockPage;
}

interface MockPage {
  title: string;
  outlines: Array<{ left: number; top: number; html: string }>;
  addOutline: (left: number, top: number, html: string) => void;
}

interface MockSectionGroupCollection {
  items: MockSectionGroup[];
  load: (_props: string) => void;
  getByName: (name: string) => MockSectionGroupCollection;
}

interface MockSectionCollection {
  items: MockSection[];
  load: (_props: string) => void;
  getByName: (name: string) => MockSectionCollection;
}

function createMockPage(title: string): MockPage {
  return {
    title,
    outlines: [],
    addOutline(left: number, top: number, html: string) {
      this.outlines.push({ left, top, html });
    },
  };
}

function createMockSection(name: string): MockSection {
  return {
    name,
    pages: [],
    addPage(title: string): MockPage {
      const page = createMockPage(title);
      this.pages.push(page);
      return page;
    },
  };
}

function createMockSectionCollection(sections: MockSection[]): MockSectionCollection {
  let filteredItems = sections;

  return {
    get items() {
      return filteredItems;
    },
    load(_props: string) {
      // no-op in mock - items are already available
    },
    getByName(name: string): MockSectionCollection {
      const matches = sections.filter((s) => s.name === name);
      return createMockSectionCollection(matches);
    },
  };
}

function createMockSectionGroup(name: string): MockSectionGroup {
  const sections: MockSection[] = [];
  const childGroups: MockSectionGroup[] = [];

  return {
    name,
    get sections(): MockSectionCollection {
      return createMockSectionCollection(sections);
    },
    addSection(sectionName: string): MockSection {
      const section = createMockSection(sectionName);
      sections.push(section);
      return section;
    },
    get sectionGroups(): MockSectionGroupCollection {
      return createMockSectionGroupCollection(childGroups);
    },
    addSectionGroup(groupName: string): MockSectionGroup {
      const group = createMockSectionGroup(groupName);
      childGroups.push(group);
      return group;
    },
  };
}

function createMockSectionGroupCollection(groups: MockSectionGroup[]): MockSectionGroupCollection {
  let filteredItems = groups;

  return {
    get items() {
      return filteredItems;
    },
    load(_props: string) {
      // no-op in mock
    },
    getByName(name: string): MockSectionGroupCollection {
      const matches = groups.filter((g) => g.name === name);
      return createMockSectionGroupCollection(matches);
    },
  };
}

export interface MockNotebook {
  name: string;
  sectionGroups: MockSectionGroupCollection;
  addSectionGroup: (name: string) => MockSectionGroup;
}

export interface MockContext {
  sync: () => Promise<void>;
}

export function createMockNotebook(name: string, existingGroups: MockSectionGroup[] = []): MockNotebook {
  const groups = [...existingGroups];

  return {
    name,
    get sectionGroups(): MockSectionGroupCollection {
      return createMockSectionGroupCollection(groups);
    },
    addSectionGroup(groupName: string): MockSectionGroup {
      const group = createMockSectionGroup(groupName);
      groups.push(group);
      return group;
    },
  };
}

export function createMockContext(): MockContext {
  return {
    sync: async () => {
      // no-op in mock
    },
  };
}

export function createMockSectionGroupForTest(name: string, sectionNames: string[] = []): MockSectionGroup {
  const group = createMockSectionGroup(name);
  for (const sectionName of sectionNames) {
    group.addSection(sectionName);
  }
  return group;
}
