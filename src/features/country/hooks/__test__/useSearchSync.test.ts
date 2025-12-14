import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useSearchSync } from '../useSearchSync';
import { useCountriesStore } from '../../../../shared';

jest.mock('../../../../shared', () => ({
  useCountriesStore: jest.fn(),
}));

describe('useSearchSync', () => {
  const mockSetFilters = jest.fn();
  const mockChangeClearCacheIsCalled = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useCountriesStore as unknown as jest.Mock).mockReturnValue({
      filters: { searchText: '' },
      clearCacheIsCalled: false,
      changeClearCacheIsCalled: mockChangeClearCacheIsCalled,
    });
    (useCountriesStore as any).getState = jest.fn(() => ({
      setFilters: mockSetFilters,
    }));
  });

  it('should initialize form with default values', () => {
    const { result } = renderHook(() => useSearchSync());

    expect(result.current.getValues().searchCountry).toBe('');
  });

  it('should initialize form with store filters value', () => {
    (useCountriesStore as unknown as jest.Mock).mockReturnValue({
      filters: { searchText: 'Colombia' },
      clearCacheIsCalled: false,
      changeClearCacheIsCalled: mockChangeClearCacheIsCalled,
    });

    const { result } = renderHook(() => useSearchSync());

    expect(result.current.getValues().searchCountry).toBe('Colombia');
  });

  it('should call setFilters when form value changes', async () => {
    const { result } = renderHook(() => useSearchSync());

    act(() => {
      result.current.setValue('searchCountry', 'Brazil');
    });

    await waitFor(() => {
      expect(mockSetFilters).toHaveBeenCalledWith({
        searchText: 'Brazil',
      });
    });
  });

  it('should sync form when store searchText changes', () => {
    const { result, rerender } = renderHook(() => useSearchSync());

    (useCountriesStore as unknown as jest.Mock).mockReturnValue({
      filters: { searchText: 'Argentina' },
      clearCacheIsCalled: false,
      changeClearCacheIsCalled: mockChangeClearCacheIsCalled,
    });

    rerender({});

    expect(result.current.getValues().searchCountry).toBe('Argentina');
  });

  it('should reset form when clearCacheIsCalled is true', () => {
    const { result, rerender } = renderHook(() => useSearchSync());

    act(() => {
      result.current.setValue('searchCountry', 'Test');
    });

    (useCountriesStore as unknown as jest.Mock).mockReturnValue({
      filters: { searchText: '' },
      clearCacheIsCalled: true,
      changeClearCacheIsCalled: mockChangeClearCacheIsCalled,
    });

    rerender({});

    expect(result.current.getValues().searchCountry).toBe('');
    expect(mockChangeClearCacheIsCalled).toHaveBeenCalledWith(false);
  });
});
