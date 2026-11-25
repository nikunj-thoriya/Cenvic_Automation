const IST_TIME_ZONE = 'Asia/Kolkata';

const istFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: IST_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

function getIstParts(date: Date): Record<string, string> {
  return Object.fromEntries(istFormatter.formatToParts(date).map((part) => [part.type, part.value]));
}

/** e.g. 20261119-144500 */
export function getIstCompactTimestamp(date: Date = new Date()): string {
  const p = getIstParts(date);
  return `${p.year}${p.month}${p.day}-${p.hour}${p.minute}${p.second}`;
}

/** e.g. 2026-11-19 14:45:00 IST */
export function getIstDateTime(date: Date = new Date()): string {
  const p = getIstParts(date);
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second} IST`;
}

/** e.g. AUTO-REPORT-20261119-144500 */
export function getReportName(date: Date = new Date()): string {
  return `AUTO-REPORT-${getIstCompactTimestamp(date)}`;
}
