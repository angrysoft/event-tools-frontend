function dateToString(date: Date) {
  return `${date.getFullYear()}-${addPad(date.getMonth() + 1)}-${addPad(
    date.getDate()
  )}`;
}

function dateTimeToString(date: Date | string | undefined | null) {
  if (!date) return;
  if (typeof date == "string") date = new Date(date);

  return `${dateToString(date)}T${date.toLocaleTimeString("pl-PL")}`;
}

function addPad(n: number): string {
  return n.toString().padStart(2, "0");
}

function getTimeFromDataTimeString(dateIn: string): string {
  const date = new Date(dateIn);
  return date.toLocaleTimeString();
}

function dateStringFromMonthYear(month: number, year: number) {
  if (!year || !month) return null;
  return `${year}-${addPad(month)}-01`;
}

export {
  dateToString,
  dateTimeToString,
  getTimeFromDataTimeString,
  dateStringFromMonthYear,
};
