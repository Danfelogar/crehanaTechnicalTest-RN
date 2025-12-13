import { useEffect, useRef, useState } from 'react';
import { useCountriesStore, VIDEO_SOURCES } from '../../../shared';
import { OnLoadData, OnProgressData, VideoRef } from 'react-native-video';
import { View } from 'react-native';

interface Props {
  code: string;
}

export const useDetailsCountry = ({ code }: Props) => {
  const videoRef = useRef<VideoRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(true);
  const [isSeeking, setIsSeeking] = useState(false);
  const progressBarRef = useRef<View>(null);
  const fullscreenProgressBarRef = useRef<View>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedVideo] = useState(() => {
    const randomIndex = Math.floor(Math.random() * VIDEO_SOURCES.length);
    return VIDEO_SOURCES[randomIndex];
  });

  const {
    //state
    singleCountry,
    isLoading,
    //actions
    fetchSingleCountryByCode,
    resetSingleCountry,
  } = useCountriesStore();

  useEffect(() => {
    if (code) {
      fetchSingleCountryByCode(code);
    }
    return () => {
      // Cleanup function
      resetSingleCountry();
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setIsSeeking(false);
    };
  }, [code, fetchSingleCountryByCode, resetSingleCountry]);

  // MM:SS -  Safe handling of NaN and Infinity
  const formatTime = (seconds: number) => {
    if (!seconds || !isFinite(seconds)) {
      return '00:00';
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleLoad = (data: OnLoadData) => {
    console.log('Video loaded:', data.duration);
    if (data.duration && isFinite(data.duration)) {
      setDuration(data.duration);
    }
    setIsBuffering(false);
    setIsSeeking(false);
  };

  const handleProgress = (data: OnProgressData) => {
    if (!isSeeking && data.currentTime && isFinite(data.currentTime)) {
      setCurrentTime(data.currentTime);
    }
  };

  const handleBuffer = ({
    isBuffering: buffering,
  }: {
    isBuffering: boolean;
  }) => {
    setIsBuffering(buffering);
  };

  const handleSeek = (progress: number) => {
    if (!duration || !isFinite(duration) || duration <= 0) {
      console.log('Cannot seek: invalid duration');
      return;
    }

    const clampedProgress = Math.max(0, Math.min(1, progress));
    const seekTime = duration * clampedProgress;

    console.log(
      'Seeking to:',
      seekTime,
      'seconds (Progress:',
      clampedProgress * 100,
      '%)',
    );

    if (videoRef.current && isFinite(seekTime)) {
      setIsSeeking(true);
      // Update the time immediately for visual feedback
      setCurrentTime(seekTime);
      // do Seek
      videoRef.current.seek(seekTime);
      // UPDATE: with delay
      setTimeout(() => {
        setIsSeeking(false);
      }, 500);
    }
  };

  const handleSeekComplete = () => {
    console.log('Seek complete');
    setIsSeeking(false);
  };

  const progressPercentage =
    duration > 0 && isFinite(duration) && isFinite(currentTime)
      ? (currentTime / duration) * 100
      : 0;

  // Auto-hide controls after 3 seconds
  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    setShowControls(true);

    if (isPlaying && !isBuffering && !isSeeking) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  useEffect(() => {
    resetControlsTimeout();

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, isBuffering, isSeeking]);

  // Show controls when the video is paused or buffering
  useEffect(() => {
    if (!isPlaying || isBuffering || isSeeking) {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    }
  }, [isPlaying, isBuffering, isSeeking]);

  const handleProgressBarPress = (event: any) => {
    const ref = isFullscreen ? fullscreenProgressBarRef : progressBarRef;
    if (!ref.current) return;

    ref.current.measure((_x, _y, width, _height, _pageX, _pageY) => {
      const { locationX } = event.nativeEvent;
      const progress = Math.max(0, Math.min(1, locationX / width));
      console.log(
        'Touch at:',
        locationX,
        'Width:',
        width,
        'Progress:',
        progress,
      );
      handleSeek(progress);
      resetControlsTimeout();
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    resetControlsTimeout();
  };

  const handleVideoPress = () => {
    if (showControls) {
      handlePlayPause();
    }
    resetControlsTimeout();
  };

  const handleScreenTouch = () => {
    resetControlsTimeout();
  };

  return {
    // state
    singleCountry,
    isLoading,
    isBuffering,
    isPlaying,
    currentTime,
    duration,
    progressPercentage,
    selectedVideo,
    videoRef,
    isSeeking,
    isFullscreen,
    showControls,
    progressBarRef,
    fullscreenProgressBarRef,
    //functions
    formatTime,
    handlePlayPause,
    handleLoad,
    handleProgress,
    handleBuffer,
    handleSeek,
    handleSeekComplete,
    handleProgressBarPress,
    toggleFullscreen,
    handleVideoPress,
    handleScreenTouch,
    resetControlsTimeout,
  };
};
