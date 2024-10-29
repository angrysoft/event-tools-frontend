function dateToString(date: Date) {
  return `${date.getFullYear()}-${addPad(date.getMonth() + 1)}-${addPad(
    date.getDay(),
  )}`;
}

function dateTimeToString(date: Date) {
  return date.toJSON().replace("Z", "");
}

function addPad(n: number): string {
  return n.toString().padStart(2, "0");
}

export { dateToString, dateTimeToString };
