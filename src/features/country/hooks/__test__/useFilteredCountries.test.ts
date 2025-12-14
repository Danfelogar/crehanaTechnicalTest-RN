import { renderHook } from '@testing-library/react-native';
import { useFilteredCountries } from '../useFilteredCountries';
import { Country } from '../../model';
import { useCountriesStore } from '../../../../shared';

jest.mock('../../../../shared', () => ({
  useCountriesStore: jest.fn(),
}));

describe('useFilteredCountries', () => {
  const mockCountries: Country[] = [
    {
      code: 'CO',
      name: 'Colombia',
      emoji: '🇨🇴',
      capital: 'Bogotá',
      currency: 'COP',
      continent: { code: 'SA', name: 'South America' },
    },
    {
      code: 'US',
      name: 'United States',
      emoji: '🇺🇸',
      capital: 'Washington',
      currency: 'USD',
      continent: { code: 'NA', name: 'North America' },
    },
    {
      code: 'BR',
      name: 'Brazil',
      emoji: '🇧🇷',
      capital: 'Brasília',
      currency: 'BRL',
      continent: { code: 'SA', name: 'South America' },
    },
    {
      code: 'ES',
      name: 'Spain',
      emoji: '🇪🇸',
      capital: 'Madrid',
      currency: 'EUR',
      continent: { code: 'EU', name: 'Europe' },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all countries when no filters applied', () => {
    (useCountriesStore as unknown as jest.Mock).mockReturnValue({
      countries: mockCountries,
      filters: { continent: 'ALL', currency: '', searchText: '' },
    });

    const { result } = renderHook(() => useFilteredCountries());

    expect(result.current).toHaveLength(4);
    expect(result.current).toEqual(mockCountries);
  });

  it('should filter by continent', () => {
    (useCountriesStore as unknown as jest.Mock).mockReturnValue({
      countries: mockCountries,
      filters: { continent: 'SA', currency: '', searchText: '' },
    });

    const { result } = renderHook(() => useFilteredCountries());

    expect(result.current).toHaveLength(2);
    expect(result.current[0].name).toBe('Colombia');
    expect(result.current[1].name).toBe('Brazil');
  });

  it('should filter by currency', () => {
    (useCountriesStore as unknown as jest.Mock).mockReturnValue({
      countries: mockCountries,
      filters: { continent: 'ALL', currency: 'USD', searchText: '' },
    });

    const { result } = renderHook(() => useFilteredCountries());

    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe('United States');
  });

  it('should filter by search text', () => {
    (useCountriesStore as unknown as jest.Mock).mockReturnValue({
      countries: mockCountries,
      filters: { continent: 'ALL', currency: '', searchText: 'bra' },
    });

    const { result } = renderHook(() => useFilteredCountries());

    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe('Brazil');
  });

  it('should filter by multiple criteria', () => {
    (useCountriesStore as unknown as jest.Mock).mockReturnValue({
      countries: mockCountries,
      filters: { continent: 'SA', currency: 'COP', searchText: '' },
    });

    const { result } = renderHook(() => useFilteredCountries());

    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe('Colombia');
  });

  it('should be case insensitive for search text', () => {
    (useCountriesStore as unknown as jest.Mock).mockReturnValue({
      countries: mockCountries,
      filters: { continent: 'ALL', currency: '', searchText: 'SPAIN' },
    });

    const { result } = renderHook(() => useFilteredCountries());

    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe('Spain');
  });

  it('should be case insensitive for currency', () => {
    (useCountriesStore as unknown as jest.Mock).mockReturnValue({
      countries: mockCountries,
      filters: { continent: 'ALL', currency: 'eur', searchText: '' },
    });

    const { result } = renderHook(() => useFilteredCountries());

    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe('Spain');
  });

  it('should return empty array when no matches found', () => {
    (useCountriesStore as unknown as jest.Mock).mockReturnValue({
      countries: mockCountries,
      filters: { continent: 'ALL', currency: '', searchText: 'xyz' },
    });

    const { result } = renderHook(() => useFilteredCountries());

    expect(result.current).toHaveLength(0);
  });

  it('should handle empty countries array', () => {
    (useCountriesStore as unknown as jest.Mock).mockReturnValue({
      countries: [],
      filters: { continent: 'ALL', currency: '', searchText: '' },
    });

    const { result } = renderHook(() => useFilteredCountries());

    expect(result.current).toHaveLength(0);
  });

  it('should filter countries without currency when currency filter is applied', () => {
    const countriesWithNoCurrency: Country[] = [
      ...mockCountries,
      {
        code: 'XX',
        name: 'No Currency Country',
        emoji: '🏳️',
        capital: 'Capital',
        currency: null as any,
        continent: { code: 'EU', name: 'Europe' },
      },
    ];

    (useCountriesStore as unknown as jest.Mock).mockReturnValue({
      countries: countriesWithNoCurrency,
      filters: { continent: 'ALL', currency: 'EUR', searchText: '' },
    });

    const { result } = renderHook(() => useFilteredCountries());

    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe('Spain');
  });
});
