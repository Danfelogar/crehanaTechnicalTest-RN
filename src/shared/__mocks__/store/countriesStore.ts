import { create } from 'zustand';
import { type StateCreator } from 'zustand';
import {
  CountriesState,
  CountriesWithoutActions,
  INITIAL_STATE,
} from '../../store';
import {
  mockCountryDetailQuery,
  mockGetContinentsQuery,
  mockGetCountriesQuery,
} from '../graphql';

export const INITIAL_STATE_MOCK: CountriesWithoutActions = INITIAL_STATE;

export const useCountriesStateTest: StateCreator<CountriesState> = (
  set,
  get,
) => ({
  ...INITIAL_STATE_MOCK,
  // Actions
  shouldRefetch: () => {
    // Dummy response
    return false;
  },

  fetchAllData: async () => {
    const { isLoading } = get();

    if (isLoading) return;

    set({ isLoading: true });

    try {
      console.log('🔄 Fetching mock data...');
      const [countriesResult, continentsResult] = await Promise.all([
        mockGetCountriesQuery(),
        mockGetContinentsQuery(),
      ]);

      const currenciesSet = new Set<string>();
      countriesResult.forEach(country => {
        if (country.currency) {
          country.currency.split(',').forEach(curr => {
            const trimmed = curr.trim();
            if (trimmed) currenciesSet.add(trimmed);
          });
        }
      });

      const currencies = Array.from(currenciesSet).sort();

      set({
        countries: countriesResult,
        continents: continentsResult,
        currencies,
        lastFetch: Date.now(),
        isLoading: false,
        isInitialized: true,
      });

      console.log(
        `✅ Cached ${countriesResult.length} countries, ${continentsResult.length} continents, ${currencies.length} currencies`,
      );
    } catch (error) {
      console.error('❌ Error fetching mock data:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  setFilters: newFilters => {
    set(state => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  resetFilters: () => {
    set({
      filters: {
        searchText: '',
        continent: 'ALL',
        currency: '',
      },
    });
  },

  clearCache: () => {
    set({
      countries: [],
      continents: [],
      currencies: [],
      lastFetch: null,
      isInitialized: false,
      clearCacheIsCalled: true,
    });
  },

  changeClearCacheIsCalled: value => {
    set({ clearCacheIsCalled: value });
  },

  fetchSingleCountryByCode: async (code: string) => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true });

    try {
      const singleCountry = await mockCountryDetailQuery(code);

      set({
        singleCountry,
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      console.error('❌ Error fetching mock country detail:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  resetSingleCountry: () => {
    set({ singleCountry: null });
  },
});

export const useCountriesStoreMock = create<CountriesState>(
  useCountriesStateTest,
);
