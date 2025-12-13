// hooks/useSearchSync.ts
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCountriesStore } from '../../../shared';

export const useSearchSync = () => {
  const { filters, clearCacheIsCalled, changeClearCacheIsCalled } =
    useCountriesStore();

  const form = useForm({
    defaultValues: {
      searchCountry: filters.searchText || '',
    },
  });

  // always listening change in form for searchCountry -> store
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'searchCountry') {
        const searchValue = value.searchCountry || '';
        useCountriesStore.getState().setFilters({
          searchText: searchValue,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  //  Synchronize store -> form (for clearCache and other changes)
  useEffect(() => {
    if (filters.searchText !== form.getValues().searchCountry) {
      form.setValue('searchCountry', filters.searchText || '');
    }
  }, [filters.searchText, form]);

  useEffect(() => {
    if (clearCacheIsCalled) {
      form.reset({ searchCountry: '' });
      changeClearCacheIsCalled(false);
    }
  }, [clearCacheIsCalled, form, changeClearCacheIsCalled]);

  return form;
};
