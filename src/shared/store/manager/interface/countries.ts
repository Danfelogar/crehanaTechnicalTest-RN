import {
  Continent,
  Country,
  CountryDetailResponse,
} from '../../../../features';

export interface CountriesFilters {
  searchText?: string;
  continent?: string;
  currency?: string;
}

export interface CountriesState {
  // state
  countries: Country[];
  singleCountry?: CountryDetailResponse | null;
  continents: Continent[];
  currencies: string[];
  lastFetch: number | null;
  filters: CountriesFilters;
  // Loading states
  isLoading: boolean;
  isInitialized: boolean;
  clearCacheIsCalled: boolean;
  // Actions
  shouldRefetch: () => boolean;
  fetchAllData: () => Promise<void>;
  fetchSingleCountryByCode: (code: string) => Promise<void>;
  setFilters: (filters: Partial<CountriesFilters>) => void;
  resetFilters: () => void;
  clearCache: () => void;
  changeClearCacheIsCalled: (value: boolean) => void;
  resetSingleCountry: () => void;
}

export interface CountriesWithoutActions
  extends Omit<
    CountriesState,
    | 'fetchAllData'
    | 'fetchSingleCountryByCode'
    | 'setFilters'
    | 'resetFilters'
    | 'clearCache'
    | 'changeClearCacheIsCalled'
    | 'shouldRefetch'
    | 'resetSingleCountry'
  > {}
