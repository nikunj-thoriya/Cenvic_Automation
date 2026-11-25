import { getIstCompactTimestamp } from './timestamp';

/** Marks data entered by automation so it can be separated from manual data. */
export const AUTO_PREFIX = 'auto';

/** e.g. 20261119144500123 — IST time plus a random part to stay unique across parallel workers. */
export function getUniqueSuffix(): string {
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `${getIstCompactTimestamp().replace('-', '')}${random}`;
}

/** e.g. "auto Rahul Sharma" */
export function autoText(value: string, separator = ' '): string {
  return `${AUTO_PREFIX}${separator}${value}`;
}

/** e.g. "auto Rahul Sharma 20261119144500123" */
export function autoUniqueText(value: string, separator = ' '): string {
  return `${autoText(value, separator)}${separator}${getUniqueSuffix()}`;
}

/** e.g. "auto.rahul.20261119144500123@example.com" */
export function autoEmail(localPart: string, domain: string): string {
  return `${AUTO_PREFIX}.${localPart}.${getUniqueSuffix()}@${domain}`;
}
