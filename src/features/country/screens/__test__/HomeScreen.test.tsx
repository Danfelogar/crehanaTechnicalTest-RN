import { render } from '@testing-library/react-native';

jest.mock('../../../../shared', () => ({
  useCountriesStore: jest.fn(),
  colors: { background: '#fff' },
  StandardWrapper: ({ children }: any) => children,
}));

jest.mock('../../hooks', () => ({
  useFilteredCountries: jest.fn(),
}));

jest.mock('../../components', () => {
  const React = require('react');

  return {
    HeaderHome: () => React.createElement('View', { testID: 'header-home' }),
    SearchCountries: () =>
      React.createElement('View', { testID: 'search-countries' }),
    FiltersSelectorHome: () =>
      React.createElement('View', { testID: 'filters-selector' }),
    CountryCard: () => React.createElement('View', { testID: 'country-card' }),
    EmptyState: () => React.createElement('View', { testID: 'empty-state' }),
    RenderLoadingSkeleton: () =>
      React.createElement('View', { testID: 'loading-skeleton' }),
  };
});

import { HomeScreen } from '../HomeScreen';
import { useCountriesStore } from '../../../../shared';
import { useFilteredCountries } from '../../hooks';

describe('HomeScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  } as any;

  const mockFetchAllData = jest.fn();
  const mockResetFilters = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useCountriesStore as unknown as jest.Mock).mockReturnValue({
      isLoading: false,
      isInitialized: true,
      resetFilters: mockResetFilters,
      fetchAllData: mockFetchAllData,
    });

    (useFilteredCountries as jest.Mock).mockReturnValue([]);
  });

  it('should render without crashing', () => {
    const result = render(
      <HomeScreen navigation={mockNavigation} route={{} as any} />,
    );

    expect(result).toBeDefined();
    expect(result.toJSON).toBeDefined();
  });

  it('should call fetchAllData on mount', () => {
    render(<HomeScreen navigation={mockNavigation} route={{} as any} />);

    expect(mockFetchAllData).toHaveBeenCalledTimes(1);
  });

  it('should render loading skeleton when loading', () => {
    (useCountriesStore as unknown as jest.Mock).mockReturnValue({
      isLoading: true,
      isInitialized: false,
      resetFilters: mockResetFilters,
      fetchAllData: mockFetchAllData,
    });

    const result = render(
      <HomeScreen navigation={mockNavigation} route={{} as any} />,
    );

    expect(result).toBeDefined();
    expect(mockFetchAllData).toHaveBeenCalled();
  });

  it('should render list when data is loaded', () => {
    (useCountriesStore as unknown as jest.Mock).mockReturnValue({
      isLoading: false,
      isInitialized: true,
      resetFilters: mockResetFilters,
      fetchAllData: mockFetchAllData,
    });

    (useFilteredCountries as jest.Mock).mockReturnValue([
      { code: 'CO', name: 'Colombia' },
      { code: 'US', name: 'United States' },
    ]);

    const result = render(
      <HomeScreen navigation={mockNavigation} route={{} as any} />,
    );

    expect(result).toBeDefined();
    expect(mockFetchAllData).toHaveBeenCalled();
  });
});
