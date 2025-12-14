import { renderHook, act } from '@testing-library/react-native';
import { useFilters } from '../useFilters';
import { useCountriesStore } from '../../../../shared';

jest.mock('../../../../shared', () => ({
  useCountriesStore: jest.fn(),
}));

describe('useFilters', () => {
  const mockSetFilters = jest.fn();
  const mockContinents = [
    { code: 'SA', name: 'South America' },
    { code: 'EU', name: 'Europe' },
  ];
  const mockCurrencies = ['USD', 'EUR', 'COP'];

  beforeEach(() => {
    jest.clearAllMocks();
    (useCountriesStore as unknown as jest.Mock).mockReturnValue({
      continents: mockContinents,
      currencies: mockCurrencies,
      filters: { continent: 'ALL', currency: '' },
      setFilters: mockSetFilters,
      isLoading: false,
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useFilters());

    expect(result.current.filters.continent).toBe('ALL');
    expect(result.current.filters.currency).toBe('');
    expect(result.current.isLoading).toBe(false);
  });

  it('should generate continent options correctly', () => {
    const { result } = renderHook(() => useFilters());

    expect(result.current.continentOptions).toHaveLength(3);
    expect(result.current.continentOptions[0]).toEqual({
      label: 'All Continents',
      value: 'ALL',
    });
    expect(result.current.continentOptions[1]).toEqual({
      label: 'South America',
      value: 'SA',
    });
  });

  it('should generate currency options correctly', () => {
    const { result } = renderHook(() => useFilters());

    expect(result.current.currencyOptions).toHaveLength(4);
    expect(result.current.currencyOptions[0]).toEqual({
      label: 'All Currencies',
      value: '',
    });
    expect(result.current.currencyOptions[1]).toEqual({
      label: 'USD',
      value: 'USD',
    });
  });

  it('should call setFilters when handleContinentChange is called', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.handleContinentChange('SA');
    });

    expect(mockSetFilters).toHaveBeenCalledWith({ continent: 'SA' });
  });

  it('should call setFilters when handleCurrencyChange is called', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.handleCurrencyChange('USD');
    });

    expect(mockSetFilters).toHaveBeenCalledWith({ currency: 'USD' });
  });

  it('should handle empty continents array', () => {
    (useCountriesStore as unknown as jest.Mock).mockReturnValue({
      continents: [],
      currencies: mockCurrencies,
      filters: { continent: 'ALL', currency: '' },
      setFilters: mockSetFilters,
      isLoading: false,
    });

    const { result } = renderHook(() => useFilters());

    expect(result.current.continentOptions).toHaveLength(1);
    expect(result.current.continentOptions[0].label).toBe('All Continents');
  });

  it('should handle empty currencies array', () => {
    (useCountriesStore as unknown as jest.Mock).mockReturnValue({
      continents: mockContinents,
      currencies: [],
      filters: { continent: 'ALL', currency: '' },
      setFilters: mockSetFilters,
      isLoading: false,
    });

    const { result } = renderHook(() => useFilters());

    expect(result.current.currencyOptions).toHaveLength(1);
    expect(result.current.currencyOptions[0].label).toBe('All Currencies');
  });

  it('should sync form when store filters change', () => {
    const { rerender } = renderHook(() => useFilters());

    (useCountriesStore as unknown as jest.Mock).mockReturnValue({
      continents: mockContinents,
      currencies: mockCurrencies,
      filters: { continent: 'EU', currency: 'EUR' },
      setFilters: mockSetFilters,
      isLoading: false,
    });

    rerender({});

    expect(mockSetFilters).toHaveBeenCalled();
  });
});
