import { CountryDetailResponse } from '../../../features';

// Mock data for countries
export const MOCK_COUNTRY_DETAIL: CountryDetailResponse = {
  country: {
    code: 'CO',
    name: 'Colombia',
    capital: 'Bogotá',
    currency: 'COP',
    currencies: ['COP'],
    continent: {
      code: 'SA',
      name: 'South America',
    },
    languages: [
      {
        code: 'es',
        name: 'Spanish',
        native: 'Español',
      },
    ],
    emoji: '🇨🇴',
    native: 'Colombia',
    phone: '57',
    phones: ['57'],
  },
};

export const MOCK_COUNTRIES_MAP: Record<string, CountryDetailResponse> = {
  CO: MOCK_COUNTRY_DETAIL,
  US: {
    country: {
      code: 'US',
      name: 'United States',
      capital: 'Washington D.C.',
      currency: 'USD',
      currencies: ['USD'],
      continent: {
        code: 'NA',
        name: 'North America',
      },
      languages: [
        {
          code: 'en',
          name: 'English',
          native: 'English',
        },
      ],
      emoji: '🇺🇸',
      native: 'United States',
      phone: '1',
      phones: ['1'],
    },
  },
  ES: {
    country: {
      code: 'ES',
      name: 'Spain',
      capital: 'Madrid',
      currency: 'EUR',
      currencies: ['EUR'],
      continent: {
        code: 'EU',
        name: 'Europe',
      },
      languages: [
        {
          code: 'es',
          name: 'Spanish',
          native: 'Español',
        },
      ],
      emoji: '🇪🇸',
      native: 'España',
      phone: '34',
      phones: ['34'],
    },
  },
};

// Helper function for use in tests
export const mockCountryDetailQuery = async (
  code: string,
): Promise<CountryDetailResponse> => {
  // Simulate promise
  await new Promise(resolve => setTimeout(() => resolve(undefined), 100));

  if (!code) {
    throw new Error('Country code is required');
  }

  const country = MOCK_COUNTRIES_MAP[code];

  if (!country) {
    throw new Error(`Country with code ${code} not found`);
  }

  return country;
};
