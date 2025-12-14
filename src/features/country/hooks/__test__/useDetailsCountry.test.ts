import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useDetailsCountry } from '../useDetailsCountry';
import { useCountriesStore } from '../../../../shared';

jest.mock('../../../../shared', () => ({
  useCountriesStore: jest.fn(),
  VIDEO_SOURCES: [
    { uri: 'https://example.com/video1.mp4' },
    { uri: 'https://example.com/video2.mp4' },
  ],
}));

describe('useDetailsCountry', () => {
  const mockFetchSingleCountryByCode = jest.fn();
  const mockResetSingleCountry = jest.fn();
  const mockSingleCountry = {
    country: {
      code: 'CO',
      name: 'Colombia',
      capital: 'Bogotá',
      currency: 'COP',
      currencies: ['COP'],
      continent: { code: 'SA', name: 'South America' },
      languages: [{ code: 'es', name: 'Spanish', native: 'Español' }],
      emoji: '🇨🇴',
      native: 'Colombia',
      phone: '57',
      phones: ['57'],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (useCountriesStore as unknown as jest.Mock).mockReturnValue({
      singleCountry: mockSingleCountry,
      isLoading: false,
      fetchSingleCountryByCode: mockFetchSingleCountryByCode,
      resetSingleCountry: mockResetSingleCountry,
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useDetailsCountry({ code: 'CO' }));

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentTime).toBe(0);
    expect(result.current.duration).toBe(0);
    expect(result.current.isBuffering).toBe(true);
    expect(result.current.isSeeking).toBe(false);
    expect(result.current.isFullscreen).toBe(false);
    expect(result.current.showControls).toBe(true);
  });

  it('should fetch country data on mount', () => {
    renderHook(() => useDetailsCountry({ code: 'CO' }));

    expect(mockFetchSingleCountryByCode).toHaveBeenCalledWith('CO');
  });

  it('should cleanup on unmount', () => {
    const { unmount } = renderHook(() => useDetailsCountry({ code: 'CO' }));

    unmount();

    expect(mockResetSingleCountry).toHaveBeenCalled();
  });

  it('should format time correctly', () => {
    const { result } = renderHook(() => useDetailsCountry({ code: 'CO' }));

    expect(result.current.formatTime(0)).toBe('00:00');
    expect(result.current.formatTime(65)).toBe('01:05');
    expect(result.current.formatTime(125)).toBe('02:05');
  });

  it('should handle invalid time values', () => {
    const { result } = renderHook(() => useDetailsCountry({ code: 'CO' }));

    expect(result.current.formatTime(NaN)).toBe('00:00');
    expect(result.current.formatTime(Infinity)).toBe('00:00');
  });

  it('should toggle play/pause', () => {
    const { result } = renderHook(() => useDetailsCountry({ code: 'CO' }));

    expect(result.current.isPlaying).toBe(false);

    act(() => {
      result.current.handlePlayPause();
    });

    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.handlePlayPause();
    });

    expect(result.current.isPlaying).toBe(false);
  });

  it('should handle video load', () => {
    const { result } = renderHook(() => useDetailsCountry({ code: 'CO' }));

    act(() => {
      result.current.handleLoad({ duration: 120 } as any);
    });

    expect(result.current.duration).toBe(120);
    expect(result.current.isBuffering).toBe(false);
    expect(result.current.isSeeking).toBe(false);
  });

  it('should handle video progress', () => {
    const { result } = renderHook(() => useDetailsCountry({ code: 'CO' }));

    act(() => {
      result.current.handleProgress({ currentTime: 30 } as any);
    });

    expect(result.current.currentTime).toBe(30);
  });

  it('should handle buffering', () => {
    const { result } = renderHook(() => useDetailsCountry({ code: 'CO' }));

    act(() => {
      result.current.handleBuffer({ isBuffering: true });
    });

    expect(result.current.isBuffering).toBe(true);

    act(() => {
      result.current.handleBuffer({ isBuffering: false });
    });

    expect(result.current.isBuffering).toBe(false);
  });

  it('should calculate progress percentage correctly', () => {
    const { result } = renderHook(() => useDetailsCountry({ code: 'CO' }));

    act(() => {
      result.current.handleLoad({ duration: 100 } as any);
      result.current.handleProgress({ currentTime: 50 } as any);
    });

    expect(result.current.progressPercentage).toBe(50);
  });

  it('should toggle fullscreen', () => {
    const { result } = renderHook(() => useDetailsCountry({ code: 'CO' }));

    expect(result.current.isFullscreen).toBe(false);

    act(() => {
      result.current.toggleFullscreen();
    });

    expect(result.current.isFullscreen).toBe(true);

    act(() => {
      result.current.toggleFullscreen();
    });

    expect(result.current.isFullscreen).toBe(false);
  });

  it('should auto-hide controls after 3 seconds when playing', async () => {
    const { result } = renderHook(() => useDetailsCountry({ code: 'CO' }));

    act(() => {
      result.current.handlePlayPause();
      result.current.handleBuffer({ isBuffering: false });
    });

    expect(result.current.showControls).toBe(true);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      expect(result.current.showControls).toBe(false);
    });
  });

  it('should show controls when paused', () => {
    const { result } = renderHook(() => useDetailsCountry({ code: 'CO' }));

    act(() => {
      result.current.handlePlayPause();
    });

    act(() => {
      result.current.handlePlayPause();
    });

    expect(result.current.showControls).toBe(true);
  });

  it('should return singleCountry data', () => {
    const { result } = renderHook(() => useDetailsCountry({ code: 'CO' }));

    expect(result.current.singleCountry).toEqual(mockSingleCountry);
  });

  it('should return isLoading state', () => {
    const { result } = renderHook(() => useDetailsCountry({ code: 'CO' }));

    expect(result.current.isLoading).toBe(false);
  });

  it('should select a random video on mount', () => {
    const { result } = renderHook(() => useDetailsCountry({ code: 'CO' }));

    expect(result.current.selectedVideo).toBeDefined();
    expect(result.current.selectedVideo.uri).toMatch(/video[12]\.mp4$/);
  });
});
