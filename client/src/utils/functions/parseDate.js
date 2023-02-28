export function parseDate(date, type) {
  let dateToParse = new Date(date);
  let dateToParseDay = String(dateToParse.getDate()).padStart(2, 0);
  let dateToParseMonth = String(dateToParse.getMonth() + 1).padStart(2, 0);
  let dateToParseYear = String(dateToParse.getFullYear());
  let dateToParseHours = String(dateToParse.getHours()).padStart(2, 0);
  let dateToParseMinutes = String(dateToParse.getMinutes()).padStart(2, 0);

  if (type === "complete") {
    return `${dateToParseDay}/${dateToParseMonth}/${dateToParseYear} - ${dateToParseHours}:${dateToParseMinutes}`;
  } else if (type === "calendar") {
    return `${dateToParseYear}-${dateToParseMonth}-${dateToParseDay}`;
  } else {
    return `${dateToParseDay}/${dateToParseMonth}/${dateToParseYear}`;
  }
}
