const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function padTwo(value: number): string {
  return String(value).padStart(2, "0");
}

function getDayName(date: Date): string {
  return DAY_NAMES[date.getDay()];
}

function getMonthName(date: Date): string {
  return MONTH_NAMES[date.getMonth()];
}

export function formatPageTitle(date: Date): string {
  const year = date.getFullYear();
  const month = padTwo(date.getMonth() + 1);
  const day = padTwo(date.getDate());
  const dayName = getDayName(date);
  return `${year}-${month}-${day} ${dayName}`;
}

export function formatSectionName(date: Date): string {
  const day = padTwo(date.getDate());
  const dayName = getDayName(date);
  return `${day} ${dayName}`;
}

export function formatSectionGroupName(date: Date): string {
  const month = padTwo(date.getMonth() + 1);
  const monthName = getMonthName(date);
  return `${month} ${monthName}`;
}

export function formatNotebookName(date: Date): string {
  return String(date.getFullYear());
}
