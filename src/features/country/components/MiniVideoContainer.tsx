import { FC, RefObject } from 'react';
import Video, {
  OnLoadData,
  OnProgressData,
  VideoRef,
} from 'react-native-video';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { ActivityIndicator, IconButton } from 'react-native-paper';
import { BodyText, colors, LabelText } from '../../../shared';

interface Props {
  isFullscreen: boolean;
  videoRef: RefObject<VideoRef | null>;
  selectedVideo: {
    uri: string;
    title: string;
  };
  isPlaying: boolean;
  showControls: boolean;
  isBuffering: boolean;
  isSeeking: boolean;
  progressBarRef: RefObject<View | null>;
  progressPercentage: number;
  currentTime: number;
  duration: number;
  handleLoad: (data: OnLoadData) => void;
  handleProgress: (data: OnProgressData) => void;
  handleSeekComplete: () => void;
  handleVideoPress: () => void;
  handleProgressBarPress: (event: any) => void;
  formatTime: (seconds: number) => string;
  toggleFullscreen: () => void;
  handleBuffer: ({ isBuffering }: { isBuffering: boolean }) => void;
}

export const MiniVideoContainer: FC<Props> = ({
  duration,
  videoRef,
  isPlaying,
  isSeeking,
  currentTime,
  isBuffering,
  showControls,
  isFullscreen,
  selectedVideo,
  progressBarRef,
  progressPercentage,
  formatTime,
  handleLoad,
  handleBuffer,
  handleProgress,
  handleVideoPress,
  toggleFullscreen,
  handleSeekComplete,
  handleProgressBarPress,
}) => {
  return (
    <View style={styles.videoContainer}>
      {!isFullscreen && (
        <Video
          ref={videoRef}
          source={{
            uri: selectedVideo.uri,
            bufferConfig: {
              minBufferMs: 15000,
              maxBufferMs: 50000,
              bufferForPlaybackMs: 2500,
              bufferForPlaybackAfterRebufferMs: 5000,
            },
          }}
          style={styles.video}
          paused={!isPlaying}
          onLoad={handleLoad}
          onProgress={handleProgress}
          onBuffer={handleBuffer}
          onSeek={handleSeekComplete}
          resizeMode="contain"
          progressUpdateInterval={250}
          playInBackground={false}
          playWhenInactive={false}
        />
      )}

      <Pressable style={styles.videoOverlay} onPress={handleVideoPress}>
        {showControls && (
          <>
            {isBuffering || isSeeking ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.onPrimary} />
                {isSeeking && (
                  <BodyText
                    size="small"
                    color={colors.onPrimary}
                    style={styles.seekingText}
                  >
                    Seeking...
                  </BodyText>
                )}
              </View>
            ) : (
              <View style={styles.playPauseContainer}>
                <MaterialIcons
                  name={isPlaying ? 'pause' : 'play-arrow'}
                  size={60}
                  color={colors.onPrimary}
                />
                <BodyText
                  size="small"
                  color={colors.onPrimary}
                  style={styles.videoLabel}
                >
                  {selectedVideo.title}
                </BodyText>
              </View>
            )}
          </>
        )}
      </Pressable>

      <View style={styles.progressContainer}>
        <Pressable
          ref={progressBarRef}
          style={styles.progressBar}
          onPress={handleProgressBarPress}
        >
          <View
            style={[styles.progressFill, { width: `${progressPercentage}%` }]}
          />
          <View
            style={[styles.progressThumb, { left: `${progressPercentage}%` }]}
          />
        </Pressable>

        <View style={styles.timeContainer}>
          <LabelText size="small" color={colors.onPrimary}>
            {formatTime(currentTime)}
          </LabelText>
          <LabelText size="small" color={colors.onPrimary}>
            /
          </LabelText>
          <LabelText size="small" color={colors.onPrimary}>
            {formatTime(duration)}
          </LabelText>
        </View>

        <IconButton
          icon="fullscreen"
          iconColor={colors.onPrimary}
          size={20}
          style={styles.fullscreenButton}
          onPress={toggleFullscreen}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    backgroundColor: '#000',
    aspectRatio: 16 / 9,
    position: 'relative',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoLabel: {
    marginTop: 8,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    position: 'relative',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    top: '50%',
    width: 12,
    height: 12,
    backgroundColor: colors.onPrimary,
    borderRadius: 6,
    transform: [{ translateX: -6 }, { translateY: -6 }],
  },
  timeContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  fullscreenButton: {
    margin: 0,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  seekingText: {
    marginTop: 8,
  },
});
