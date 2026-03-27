/**
 * Service for fetching cat facts from the CatFacts API.
 * API: https://catfact.ninja
 */

import axios from 'axios';

export interface CatFact {
  fact: string;
  length: number;
}

export interface CatFactsResponse {
  data: CatFact[];
  total: number;
}

const CATFACTS_API_URL = 'https://catfact.ninja/facts';

export async function fetchCatFacts(limit: number = 100): Promise<CatFact[]> {
  try {
    const response = await axios.get<CatFactsResponse>(CATFACTS_API_URL, {
      params: {
        limit: limit,
        max_length: 300
      }
    });

    console.log(`Fetched ${response.data.data.length} cat facts from API`);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching cat facts:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}
