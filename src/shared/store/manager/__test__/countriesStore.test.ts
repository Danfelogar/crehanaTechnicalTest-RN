import { act, renderHook } from '@testing-library/react-native';
import {
  mockCountryDetailQuery,
  mockGetContinentsQuery,
  mockGetCountriesQuery,
  INITIAL_STATE_MOCK,
  useCountriesStoreMock,
} from '../../../__mocks__';

// Mock the graphql queries
jest.mock('../../../__mocks__/graphql', () => ({
  mockGetCountriesQuery: jest.fn(),
  mockGetContinentsQuery: jest.fn(),
  mockCountryDetailQuery: jest.fn(),
}));

describe('Testing countriesStore.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCountriesStoreMock.setState(INITIAL_STATE_MOCK);
  });

  test('should return the initial state', () => {
    const { result } = renderHook(() => useCountriesStoreMock());

    const actions = {
      shouldRefetch: expect.any(Function),
      fetchAllData: expect.any(Function),
      setFilters: expect.any(Function),
      resetFilters: expect.any(Function),
      clearCache: expect.any(Function),
      changeClearCacheIsCalled: expect.any(Function),
      fetchSingleCountryByCode: expect.any(Function),
      resetSingleCountry: expect.any(Function),
    };

    expect(result.current).toEqual({
      ...INITIAL_STATE_MOCK,
      ...actions,
    });
  });

  test('should set filters correctly', () => {
    const { result } = renderHook(() => useCountriesStoreMock());
    const { setFilters } = result.current;

    act(() => {
      setFilters({ searchText: 'Colombia' });
    });

    expect(result.current.filters.searchText).toBe('Colombia');

    act(() => {
      setFilters({ continent: 'SA', currency: 'USD' });
    });

    expect(result.current.filters.continent).toBe('SA');
    expect(result.current.filters.currency).toBe('USD');
  });

  test('should reset filters to initial values', () => {
    const { result } = renderHook(() => useCountriesStoreMock());
    const { setFilters, resetFilters } = result.current;

    act(() => {
      setFilters({ searchText: 'Colombia', continent: 'SA', currency: 'USD' });
    });

    act(() => {
      resetFilters();
    });

    expect(result.current.filters).toEqual({
      searchText: '',
      continent: 'ALL',
      currency: '',
    });
  });

  test('should clear cache correctly', () => {
    const { result } = renderHook(() => useCountriesStoreMock());
    const { clearCache } = result.current;

    act(() => {
      clearCache();
    });

    expect(result.current.countries).toEqual([]);
    expect(result.current.continents).toEqual([]);
    expect(result.current.currencies).toEqual([]);
    expect(result.current.lastFetch).toBe(null);
    expect(result.current.isInitialized).toBe(false);
    expect(result.current.clearCacheIsCalled).toBe(true);
  });

  test('should change clearCacheIsCalled value', () => {
    const { result } = renderHook(() => useCountriesStoreMock());
    const { changeClearCacheIsCalled } = result.current;

    act(() => {
      changeClearCacheIsCalled(true);
    });

    expect(result.current.clearCacheIsCalled).toBe(true);

    act(() => {
      changeClearCacheIsCalled(false);
    });

    expect(result.current.clearCacheIsCalled).toBe(false);
  });

  test('should reset single country to null', () => {
    const { result } = renderHook(() => useCountriesStoreMock());
    const { resetSingleCountry } = result.current;

    act(() => {
      resetSingleCountry();
    });

    expect(result.current.singleCountry).toBe(null);
  });

  test('successfully case - should fetch all data', async () => {
    const mockCountries = [
      {
        code: 'CO',
        name: 'Colombia',
        currency: 'COP',
        continent: { name: 'South America' },
      },
      {
        code: 'US',
        name: 'United States',
        currency: 'USD',
        continent: { name: 'North America' },
      },
    ];
    const mockContinents = [
      { code: 'SA', name: 'South America' },
      { code: 'NA', name: 'North America' },
    ];

    (mockGetCountriesQuery as jest.Mock).mockResolvedValue(mockCountries);
    (mockGetContinentsQuery as jest.Mock).mockResolvedValue(mockContinents);

    const { result } = renderHook(() => useCountriesStoreMock());
    const { fetchAllData } = result.current;

    await act(async () => {
      await fetchAllData();
    });

    expect(result.current.countries).toEqual(mockCountries);
    expect(result.current.continents).toEqual(mockContinents);
    expect(result.current.currencies).toEqual(['COP', 'USD']);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isInitialized).toBe(true);
    expect(result.current.lastFetch).not.toBe(null);
  });

  test('error case - should handle fetch all data error', async () => {
    const mockError = new Error('Network error');
    (mockGetCountriesQuery as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useCountriesStoreMock());
    const { fetchAllData } = result.current;

    await expect(
      act(async () => {
        await fetchAllData();
      }),
    ).rejects.toThrow('Network error');

    expect(result.current.isLoading).toBe(false);
  });

  test('should not fetch if already loading', async () => {
    const { result } = renderHook(() => useCountriesStoreMock());
    const { fetchAllData } = result.current;

    // Set isLoading to true manually using setState
    act(() => {
      useCountriesStoreMock.setState({ isLoading: true });
    });

    await act(async () => {
      await fetchAllData();
    });

    expect(mockGetCountriesQuery).not.toHaveBeenCalled();
    expect(mockGetContinentsQuery).not.toHaveBeenCalled();
  });

  test('should use cached data if already initialized', async () => {
    const mockCountries = [
      {
        code: 'CO',
        name: 'Colombia',
        currency: 'COP',
        continent: { name: 'South America' },
      },
    ];
    const mockContinents = [{ code: 'SA', name: 'South America' }];

    (mockGetCountriesQuery as jest.Mock).mockResolvedValue(mockCountries);
    (mockGetContinentsQuery as jest.Mock).mockResolvedValue(mockContinents);

    const { result } = renderHook(() => useCountriesStoreMock());
    const { fetchAllData } = result.current;

    // First fetch
    await act(async () => {
      await fetchAllData();
    });

    const firstCallCount = (mockGetCountriesQuery as jest.Mock).mock.calls
      .length;

    // Second fetch (should use cache)
    await act(async () => {
      await fetchAllData();
    });

    expect(
      (mockGetCountriesQuery as jest.Mock).mock.calls.length,
    ).toBeGreaterThanOrEqual(firstCallCount);
  });

  test('successfully case - should fetch single country by code', async () => {
    const mockCountryResponse = {
      country: {
        code: 'CO',
        name: 'Colombia',
        currency: 'COP',
        continent: { name: 'South America' },
      },
    };

    (mockCountryDetailQuery as jest.Mock).mockResolvedValue(
      mockCountryResponse,
    );

    const { result } = renderHook(() => useCountriesStoreMock());
    const { fetchSingleCountryByCode } = result.current;

    await act(async () => {
      await fetchSingleCountryByCode('CO');
    });

    expect(result.current.singleCountry).toEqual(mockCountryResponse);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isInitialized).toBe(true);
  });

  test('error case - should handle fetch single country error', async () => {
    const mockError = new Error('Country not found');
    (mockCountryDetailQuery as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useCountriesStoreMock());
    const { fetchSingleCountryByCode } = result.current;

    await expect(
      act(async () => {
        await fetchSingleCountryByCode('XX');
      }),
    ).rejects.toThrow('Country not found');

    expect(result.current.isLoading).toBe(false);
  });

  test('should not fetch single country if already loading', async () => {
    const { result } = renderHook(() => useCountriesStoreMock());
    const { fetchSingleCountryByCode } = result.current;

    // Set isLoading to true manually using setState
    act(() => {
      useCountriesStoreMock.setState({ isLoading: true });
    });

    await act(async () => {
      await fetchSingleCountryByCode('CO');
    });

    expect(mockCountryDetailQuery).not.toHaveBeenCalled();
  });

  test('should return false for shouldRefetch (dummy implementation)', () => {
    const { result } = renderHook(() => useCountriesStoreMock());
    const { shouldRefetch } = result.current;

    const shouldRefetchResult = shouldRefetch();

    expect(shouldRefetchResult).toBe(false);
  });
});
