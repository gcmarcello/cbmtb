export function isoTimezone(isoDate) {
  return new Date(new Date(isoDate).getTime() - new Date(isoDate).getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}
