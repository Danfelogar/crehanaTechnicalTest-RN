import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { CountriesState, CountriesWithoutActions } from './interface';
import { mmkvAdapter } from '../mmkvStorage';
import {
  countryDetailQuery,
  getContinentsQuery,
  getCountriesQuery,
} from '../../../features';
import { CACHE_DURATION } from '@env';

const INITIAL_STATE: CountriesWithoutActions = {
  countries: [],
  singleCountry: null,
  continents: [],
  currencies: [],
  lastFetch: null,
  filters: {
    searchText: '',
    continent: 'ALL',
    currency: '',
  },
  isLoading: false,
  clearCacheIsCalled: false,
  isInitialized: false,
};

export const useCountriesStore = create<CountriesState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,
      //actions
      shouldRefetch: () => {
        const { lastFetch } = get();
        if (!lastFetch) return true;
        return Date.now() - lastFetch > CACHE_DURATION;
      },

      fetchAllData: async () => {
        const { shouldRefetch, isLoading } = get();
        if (isLoading) return;

        if (!shouldRefetch() && get().isInitialized) {
          console.log('✅ Using cached data');
          return;
        }

        set({ isLoading: true });

        try {
          console.log('🔄 Fetching fresh data from API...');
          const [countriesResult, continentsResult] = await Promise.all([
            getCountriesQuery(),
            getContinentsQuery(),
          ]);
          // Extract unique coins
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
          console.error('❌ Error fetching data:', error);
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
          const singleCountry = await countryDetailQuery({ code });

          set({
            singleCountry,
            isLoading: false,
            isInitialized: true,
          });
        } catch (error) {
          console.error('❌ Error fetching data:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      resetSingleCountry: () => {
        set({ singleCountry: null });
      },
    }),
    {
      name: 'countries-storage', // name for MMKV
      storage: createJSONStorage(() => mmkvAdapter),
      // only persist specific parts of the state
      partialize: state => ({
        countries: state.countries,
        continents: state.continents,
        currencies: state.currencies,
        lastFetch: state.lastFetch,
        isInitialized: state.isInitialized,
      }),
    },
  ),
);
