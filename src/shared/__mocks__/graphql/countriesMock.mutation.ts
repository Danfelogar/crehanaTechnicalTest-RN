import { CountriesListResponse, Country } from '../../../features';

// Mock data for countries list
export const MOCK_COUNTRIES: Country[] = [
  {
    code: 'CO',
    name: 'Colombia',
    emoji: '🇨🇴',
    capital: 'Bogotá',
    currency: 'COP',
    continent: {
      code: 'SA',
      name: 'South America',
    },
  },
  {
    code: 'US',
    name: 'United States',
    emoji: '🇺🇸',
    capital: 'Washington D.C.',
    currency: 'USD',
    continent: {
      code: 'NA',
      name: 'North America',
    },
  },
  {
    code: 'ES',
    name: 'Spain',
    emoji: '🇪🇸',
    capital: 'Madrid',
    currency: 'EUR',
    continent: {
      code: 'EU',
      name: 'Europe',
    },
  },
  {
    code: 'BR',
    name: 'Brazil',
    emoji: '🇧🇷',
    capital: 'Brasília',
    currency: 'BRL',
    continent: {
      code: 'SA',
      name: 'South America',
    },
  },
  {
    code: 'JP',
    name: 'Japan',
    emoji: '🇯🇵',
    capital: 'Tokyo',
    currency: 'JPY',
    continent: {
      code: 'AS',
      name: 'Asia',
    },
  },
  {
    code: 'DE',
    name: 'Germany',
    emoji: '🇩🇪',
    capital: 'Berlin',
    currency: 'EUR',
    continent: {
      code: 'EU',
      name: 'Europe',
    },
  },
  {
    code: 'FR',
    name: 'France',
    emoji: '🇫🇷',
    capital: 'Paris',
    currency: 'EUR',
    continent: {
      code: 'EU',
      name: 'Europe',
    },
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    emoji: '🇬🇧',
    capital: 'London',
    currency: 'GBP',
    continent: {
      code: 'EU',
      name: 'Europe',
    },
  },
  {
    code: 'CA',
    name: 'Canada',
    emoji: '🇨🇦',
    capital: 'Ottawa',
    currency: 'CAD',
    continent: {
      code: 'NA',
      name: 'North America',
    },
  },
  {
    code: 'AU',
    name: 'Australia',
    emoji: '🇦🇺',
    capital: 'Canberra',
    currency: 'AUD',
    continent: {
      code: 'OC',
      name: 'Oceania',
    },
  },
];

export const MOCK_COUNTRIES_LIST_RESPONSE: CountriesListResponse = {
  countries: MOCK_COUNTRIES,
};

// Helper function
export const mockGetCountriesQuery = async (): Promise<Country[]> => {
  // Simulate promise
  await new Promise(resolve => setTimeout(() => resolve(undefined), 100));

  return MOCK_COUNTRIES;
};
