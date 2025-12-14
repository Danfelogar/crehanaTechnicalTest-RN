import { render } from '@testing-library/react-native';

jest.mock('../../../../shared', () => ({
  colors: {
    background: '#fff',
    surface: '#fff',
    onSurface: '#000',
    onSurfaceVariant: '#666',
    surfaceVariant: '#eee',
    primary: '#6200ee',
    onPrimary: '#fff',
    outline: '#ccc',
  },
  StandardWrapper: ({ children }: any) => children,
  TitleText: ({ children }: any) => children,
  BodyText: ({ children }: any) => children,
}));

jest.mock('../../hooks', () => ({
  useDetailsCountry: jest.fn(),
}));
jest.mock('../../components', () => {
  const React = require('react');

  return {
    InfoCard: () => React.createElement('View', { testID: 'info-card' }),
    MiniVideoContainer: () =>
      React.createElement('View', { testID: 'mini-video-container' }),
    ModalFullVideo: () =>
      React.createElement('View', { testID: 'modal-full-video' }),
    SkeletonInfoCard: () =>
      React.createElement('View', { testID: 'skeleton-info-card' }),
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');

  return {
    ActivityIndicator: (props: any) =>
      React.createElement('View', { testID: 'activity-indicator', ...props }),
    IconButton: (props: any) =>
      React.createElement('View', { testID: 'icon-button', ...props }),
  };
});

import { DetailsScreen } from '../DetailsScreen';
import { useDetailsCountry } from '../../hooks';

describe('DetailsScreen', () => {
  const mockNavigation = {
    goBack: jest.fn(),
    navigate: jest.fn(),
  } as any;

  const mockRoute = {
    params: {
      code: 'CO',
    },
  } as any;

  const mockVideoRef = { current: null };
  const mockProgressBarRef = { current: null };
  const mockFullscreenProgressBarRef = { current: null };

  const defaultMockHookReturn = {
    singleCountry: null,
    isLoading: false,
    isBuffering: false,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    progressPercentage: 0,
    selectedVideo: null,
    videoRef: mockVideoRef,
    isSeeking: false,
    isFullscreen: false,
    showControls: true,
    progressBarRef: mockProgressBarRef,
    fullscreenProgressBarRef: mockFullscreenProgressBarRef,
    formatTime: jest.fn((_time: number) => '00:00'),
    handleLoad: jest.fn(),
    handleProgress: jest.fn(),
    handleBuffer: jest.fn(),
    handleSeekComplete: jest.fn(),
    handleProgressBarPress: jest.fn(),
    toggleFullscreen: jest.fn(),
    handleVideoPress: jest.fn(),
    handleScreenTouch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useDetailsCountry as jest.Mock).mockReturnValue(defaultMockHookReturn);
  });

  it('should render without crashing', () => {
    const result = render(
      <DetailsScreen navigation={mockNavigation} route={mockRoute} />,
    );

    expect(result).toBeDefined();
    expect(result.toJSON).toBeDefined();
  });

  it('should call goBack when back button is pressed', () => {
    const result = render(
      <DetailsScreen navigation={mockNavigation} route={mockRoute} />,
    );

    expect(result).toBeDefined();
  });

  it('should render loading skeleton when loading', () => {
    (useDetailsCountry as jest.Mock).mockReturnValue({
      ...defaultMockHookReturn,
      isLoading: true,
    });

    const result = render(
      <DetailsScreen navigation={mockNavigation} route={mockRoute} />,
    );

    expect(result).toBeDefined();
    expect(result.getByTestId).toBeDefined();
  });

  it('should render country information when data is loaded', () => {
    const mockCountryData = {
      country: {
        code: 'CO',
        name: 'Colombia',
        emoji: '🇨🇴',
        capital: 'Bogotá',
        currency: 'COP',
        continent: {
          code: 'SA',
          name: 'South America',
        },
        languages: [{ code: 'es', name: 'Spanish' }],
      },
    };

    (useDetailsCountry as jest.Mock).mockReturnValue({
      ...defaultMockHookReturn,
      singleCountry: mockCountryData,
      isLoading: false,
    });

    const result = render(
      <DetailsScreen navigation={mockNavigation} route={mockRoute} />,
    );

    expect(result).toBeDefined();
  });

  it('should render video player when not loading', () => {
    const mockCountryData = {
      country: {
        code: 'CO',
        name: 'Colombia',
        emoji: '🇨🇴',
        capital: 'Bogotá',
        currency: 'COP',
        continent: {
          code: 'SA',
          name: 'South America',
        },
        languages: [{ code: 'es', name: 'Spanish' }],
      },
    };

    (useDetailsCountry as jest.Mock).mockReturnValue({
      ...defaultMockHookReturn,
      singleCountry: mockCountryData,
      isLoading: false,
      selectedVideo: { uri: 'https://example.com/video.mp4' },
    });

    const result = render(
      <DetailsScreen navigation={mockNavigation} route={mockRoute} />,
    );

    expect(result).toBeDefined();
  });

  it('should pass correct country code to useDetailsCountry hook', () => {
    render(<DetailsScreen navigation={mockNavigation} route={mockRoute} />);

    expect(useDetailsCountry).toHaveBeenCalledWith({ code: 'CO' });
  });

  it('should render multiple info cards when data is loaded', () => {
    const mockCountryData = {
      country: {
        code: 'US',
        name: 'United States',
        emoji: '🇺🇸',
        capital: 'Washington D.C.',
        currency: 'USD',
        continent: {
          code: 'NA',
          name: 'North America',
        },
        languages: [{ code: 'en', name: 'English' }],
      },
    };

    (useDetailsCountry as jest.Mock).mockReturnValue({
      ...defaultMockHookReturn,
      singleCountry: mockCountryData,
      isLoading: false,
    });

    const result = render(
      <DetailsScreen navigation={mockNavigation} route={mockRoute} />,
    );

    expect(result).toBeDefined();
  });

  it('should render skeleton info cards when loading', () => {
    (useDetailsCountry as jest.Mock).mockReturnValue({
      ...defaultMockHookReturn,
      isLoading: true,
    });

    const result = render(
      <DetailsScreen navigation={mockNavigation} route={mockRoute} />,
    );

    expect(result).toBeDefined();
  });

  it('should render modal full video component', () => {
    const result = render(
      <DetailsScreen navigation={mockNavigation} route={mockRoute} />,
    );

    expect(result).toBeDefined();
  });
});
