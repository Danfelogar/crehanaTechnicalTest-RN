import { useMemo } from 'react';
import { useCountriesStore } from '../../../shared';
import { Country } from '../model';

export const useFilteredCountries = (): Country[] => {
  const { countries, filters } = useCountriesStore();

  const filteredCountries = useMemo(() => {
    let result = countries;

    // Filter by continent
    if (filters.continent && filters.continent !== 'ALL') {
      result = result.filter(
        country => country.continent.code === filters.continent,
      );
    }

    // Filter by currency
    if (filters.currency && filters.currency.trim() !== '') {
      const currencyLower = filters.currency.toLowerCase();
      result = result.filter(country =>
        country.currency
          ? country.currency.toLowerCase().includes(currencyLower)
          : false,
      );
    }

    // Filter by name (case-insensitive)
    if (filters.searchText && filters.searchText.trim() !== '') {
      const searchLower = filters.searchText.toLowerCase();
      result = result.filter(country =>
        country.name.toLowerCase().includes(searchLower),
      );
    }

    return result;
  }, [countries, filters]);

  return filteredCountries;
};
