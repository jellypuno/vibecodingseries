/**
 * Utility for converting cat facts to CSV format.
 */

import { CatFact } from '../services/catfacts';

export function convertToCsv(facts: CatFact[]): string {
  const header = 'FACT,LENGTH';
  const rows = facts.map(fact => {
    const escapedFact = escapeCsvField(fact.fact);
    return `${escapedFact},${fact.length}`;
  });

  return [header, ...rows].join('\n');
}

function escapeCsvField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    const escaped = field.replace(/"/g, '""');
    return `"${escaped}"`;
  }
  return field;
}
