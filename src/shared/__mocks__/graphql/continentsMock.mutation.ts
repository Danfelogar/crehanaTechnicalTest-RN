import { ContinentsResponse } from '../../../features';

// Mock data for continents
export const MOCK_CONTINENTS: ContinentsResponse['continents'] = [
  {
    code: 'AF',
    name: 'Africa',
  },
  {
    code: 'AN',
    name: 'Antarctica',
  },
  {
    code: 'AS',
    name: 'Asia',
  },
  {
    code: 'EU',
    name: 'Europe',
  },
  {
    code: 'NA',
    name: 'North America',
  },
  {
    code: 'OC',
    name: 'Oceania',
  },
  {
    code: 'SA',
    name: 'South America',
  },
];

export const MOCK_CONTINENTS_RESPONSE: ContinentsResponse = {
  continents: MOCK_CONTINENTS,
};

// Helper function
export const mockGetContinentsQuery = async (): Promise<
  ContinentsResponse['continents']
> => {
  // Simulate promise
  await new Promise(resolve => setTimeout(() => resolve(undefined), 100));

  return MOCK_CONTINENTS;
};
