export function isoTimezone(isoDate, format) {
  let date;
  switch (format) {
    case "excel":
      date = new Date(new Date(isoDate).getTime() - new Date(isoDate).getTimezoneOffset() * 60000).toISOString();

      return date;

    default:
      return new Date(new Date(isoDate).getTime() - new Date(isoDate).getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }
}
