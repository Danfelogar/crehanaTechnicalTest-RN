import { useEffect, useRef, useState } from 'react';
import { useCountriesStore, VIDEO_SOURCES } from '../../../shared';
import { OnLoadData, OnProgressData, VideoRef } from 'react-native-video';

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

  const [selectedVideo] = useState(() => {
    const randomIndex = Math.floor(Math.random() * VIDEO_SOURCES.length);
    return VIDEO_SOURCES[0];
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

  // MM:SS - Manejo seguro de NaN e Infinity
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
    // Validación de duración
    if (data.duration && isFinite(data.duration)) {
      setDuration(data.duration);
    }
    setIsBuffering(false);
    setIsSeeking(false);
  };

  const handleProgress = (data: OnProgressData) => {
    // Solo actualizar si no estamos haciendo seek
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
    // Validar que tenemos una duración válida antes de hacer seek
    if (!duration || !isFinite(duration) || duration <= 0) {
      console.log('Cannot seek: invalid duration');
      return;
    }

    // Asegurar que el progress esté entre 0 y 1
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
      // Marcar que estamos haciendo seek
      setIsSeeking(true);

      // Actualizar el tiempo inmediatamente para feedback visual
      setCurrentTime(seekTime);

      // Realizar el seek
      videoRef.current.seek(seekTime);

      // Después de un breve delay, permitir actualizaciones de progreso nuevamente
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

  return {
    //state
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
    //handlers
    formatTime,
    handlePlayPause,
    handleLoad,
    handleProgress,
    handleBuffer,
    handleSeek,
    handleSeekComplete,
  };
};
