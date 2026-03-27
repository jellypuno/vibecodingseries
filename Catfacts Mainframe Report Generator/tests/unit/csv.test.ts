import { describe, it, expect } from 'vitest';
import { convertToCsv } from '../../src/utils/csv';
import { CatFact } from '../../src/services/catfacts';

describe('csv.ts', () => {
  describe('convertToCsv', () => {
    it('should convert cat facts to CSV format', () => {
      const facts: CatFact[] = [
        { fact: 'Cats sleep 70% of their lives', length: 33 },
        { fact: 'Cats can rotate their ears 180 degrees', length: 40 }
      ];

      const result = convertToCsv(facts);

      expect(result).toBe(
        'FACT,LENGTH\n' +
        'Cats sleep 70% of their lives,33\n' +
        'Cats can rotate their ears 180 degrees,40'
      );
    });

    it('should handle empty array', () => {
      const facts: CatFact[] = [];

      const result = convertToCsv(facts);

      expect(result).toBe('FACT,LENGTH');
    });

    it('should escape fields containing commas', () => {
      const facts: CatFact[] = [
        { fact: 'Cats, like, commas', length: 18 }
      ];

      const result = convertToCsv(facts);

      expect(result).toBe('FACT,LENGTH\n"Cats, like, commas",18');
    });

    it('should escape fields containing double quotes', () => {
      const facts: CatFact[] = [
        { fact: 'Cats say "meow"', length: 14 }
      ];

      const result = convertToCsv(facts);

      expect(result).toBe('FACT,LENGTH\n"Cats say ""meow""",14');
    });

    it('should escape fields containing newlines', () => {
      const facts: CatFact[] = [
        { fact: 'Cats\nhave\nnewlines', length: 18 }
      ];

      const result = convertToCsv(facts);

      expect(result).toBe('FACT,LENGTH\n"Cats\nhave\nnewlines",18');
    });

    it('should escape fields with all special characters', () => {
      const facts: CatFact[] = [
        { fact: 'Cats, say "meow"\nand then sleep', length: 30 }
      ];

      const result = convertToCsv(facts);

      expect(result).toBe('FACT,LENGTH\n"Cats, say ""meow""\nand then sleep",30');
    });

    it('should handle single fact', () => {
      const facts: CatFact[] = [
        { fact: 'A single fact', length: 14 }
      ];

      const result = convertToCsv(facts);

      expect(result).toBe('FACT,LENGTH\nA single fact,14');
    });
  });
});
