// hooks/useFilters.ts
import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useCountriesStore } from '../../../shared';

interface FilterForm {
  continent: string;
  currency: string;
}

export const useFilters = () => {
  const { continents, currencies, filters, setFilters, isLoading } =
    useCountriesStore();

  const { control, setValue } = useForm<FilterForm>({
    defaultValues: {
      continent: filters.continent || 'ALL',
      currency: filters.currency || '',
    },
  });

  const watchedContinent = useWatch({ control, name: 'continent' });
  const watchedCurrency = useWatch({ control, name: 'currency' });

  useEffect(() => {
    if (watchedContinent !== undefined) {
      setFilters({ continent: watchedContinent });
    }
  }, [watchedContinent, setFilters]);

  useEffect(() => {
    if (watchedCurrency !== undefined) {
      setFilters({ currency: watchedCurrency });
    }
  }, [watchedCurrency, setFilters]);

  useEffect(() => {
    const syncFormWithStore = () => {
      if (filters.continent !== watchedContinent) {
        setValue('continent', filters.continent || 'ALL');
      }
      if (filters.currency !== watchedCurrency) {
        setValue('currency', filters.currency || '');
      }
    };

    syncFormWithStore();
  }, [
    filters.continent,
    filters.currency,
    setValue,
    watchedContinent,
    watchedCurrency,
  ]);

  const continentOptions = useMemo(() => {
    const options = [{ label: 'All Continents', value: 'ALL' }];

    if (continents?.length) {
      continents.forEach(continent => {
        options.push({
          label: continent.name,
          value: continent.code,
        });
      });
    }

    return options;
  }, [continents]);

  const currencyOptions = useMemo(() => {
    const options = [{ label: 'All Currencies', value: '' }];

    if (currencies?.length) {
      currencies.forEach(currency => {
        options.push({
          label: currency,
          value: currency,
        });
      });
    }

    return options;
  }, [currencies]);

  const handleContinentChange = (value: string) => {
    console.log('Continent selected:', value);
    setFilters({ continent: value });
  };

  const handleCurrencyChange = (value: string) => {
    console.log('Currency selected:', value);
    setFilters({ currency: value });
  };

  return {
    // states
    control,
    isLoading,
    continentOptions,
    currencyOptions,
    filters,
    // actions
    handleContinentChange,
    handleCurrencyChange,
  };
};
