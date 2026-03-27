import { describe, it, expect, beforeEach } from 'vitest';
import axios from 'axios';
import { fetchCatFacts, CatFact } from '../../src/services/catfacts';

vi.mock('axios');

describe('catfacts.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchCatFacts', () => {
    it('should fetch cat facts from the API', async () => {
      const mockData: CatFact[] = [
        { fact: 'Cats sleep 70% of their lives', length: 33 },
        { fact: 'Cats can rotate their ears 180 degrees', length: 40 }
      ];

      (axios.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: {
          data: mockData,
          total: 2
        }
      });

      const result = await fetchCatFacts(2);

      expect(axios.get).toHaveBeenCalledWith(
        'https://catfact.ninja/facts',
        {
          params: {
            limit: 2,
            max_length: 300
          }
        }
      );
      expect(result).toEqual(mockData);
    });

    it('should use default limit of 100', async () => {
      (axios.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: {
          data: [],
          total: 0
        }
      });

      await fetchCatFacts();

      expect(axios.get).toHaveBeenCalledWith(
        'https://catfact.ninja/facts',
        {
          params: {
            limit: 100,
            max_length: 300
          }
        }
      );
    });

    it('should handle API errors', async () => {
      (axios.get as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network Error'));

      await expect(fetchCatFacts()).rejects.toThrow('Network Error');
    });
  });
});
