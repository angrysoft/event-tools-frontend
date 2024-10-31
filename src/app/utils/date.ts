function dateToString(date: Date) {
  return `${date.getFullYear()}-${addPad(date.getMonth() + 1)}-${addPad(
    date.getDate(),
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

export { dateToString, dateTimeToString };
