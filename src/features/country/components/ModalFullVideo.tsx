import { FC, RefObject } from 'react';
import { Pressable, StyleSheet, View, Modal, StatusBar } from 'react-native';
import { ActivityIndicator, IconButton } from 'react-native-paper';
import Video, {
  OnLoadData,
  OnProgressData,
  VideoRef,
} from 'react-native-video';
import {
  BodyText,
  colors,
  heightFullScreen,
  LabelText,
  widthFullScreen,
} from '../../../shared';
import MaterialIcons from '@react-native-vector-icons/material-icons';

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
  fullscreenProgressBarRef: RefObject<View | null>;
  progressPercentage: number;
  currentTime: number;
  duration: number;
  toggleFullscreen: () => void;
  handleScreenTouch: () => void;
  handleLoad: (data: OnLoadData) => void;
  handleProgress: (data: OnProgressData) => void;
  handleBuffer: ({ isBuffering }: { isBuffering: boolean }) => void;
  handleSeekComplete: () => void;
  handleVideoPress: () => void;
  handleProgressBarPress: (event: any) => void;
  formatTime: (seconds: number) => string;
}

export const ModalFullVideo: FC<Props> = ({
  videoRef,
  duration,
  isPlaying,
  isSeeking,
  currentTime,
  isBuffering,
  showControls,
  isFullscreen,
  selectedVideo,
  progressPercentage,
  fullscreenProgressBarRef,
  handleLoad,
  formatTime,
  handleBuffer,
  handleProgress,
  handleVideoPress,
  toggleFullscreen,
  handleScreenTouch,
  handleSeekComplete,
  handleProgressBarPress,
}) => {
  return (
    <Modal
      visible={isFullscreen}
      animationType="fade"
      onRequestClose={toggleFullscreen}
      supportedOrientations={['portrait', 'landscape']}
    >
      <StatusBar hidden />
      <Pressable style={styles.fullscreenContainer} onPress={handleScreenTouch}>
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
          style={styles.fullscreenVideo}
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

        <Pressable style={styles.fullscreenOverlay} onPress={handleVideoPress}>
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
                    size={80}
                    color={colors.onPrimary}
                  />
                </View>
              )}
            </>
          )}
        </Pressable>

        {/* Controles superiores */}
        {showControls && (
          <View style={styles.fullscreenTopControls}>
            <IconButton
              icon="close"
              iconColor={colors.onPrimary}
              size={28}
              onPress={toggleFullscreen}
              style={styles.closeButton}
            />
            <BodyText
              size="medium"
              color={colors.onPrimary}
              style={styles.fullscreenTitle}
            >
              {selectedVideo.title}
            </BodyText>
          </View>
        )}

        {/* Controles inferiores */}
        {showControls && (
          <View style={styles.fullscreenBottomControls}>
            <Pressable
              ref={fullscreenProgressBarRef}
              style={styles.fullscreenProgressBar}
              onPress={handleProgressBarPress}
            >
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPercentage}%` },
                ]}
              />
              <View
                style={[
                  styles.progressThumb,
                  { left: `${progressPercentage}%` },
                ]}
              />
            </Pressable>

            <View style={styles.fullscreenTimeContainer}>
              <LabelText size="medium" color={colors.onPrimary}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </LabelText>
            </View>
          </View>
        )}
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
    width: widthFullScreen,
    height: heightFullScreen,
  },
  fullscreenVideo: {
    width: '100%',
    height: '100%',
  },
  fullscreenOverlay: {
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  seekingText: {
    marginTop: 8,
  },
  fullscreenTopControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  closeButton: {
    margin: 0,
  },
  fullscreenTitle: {
    flex: 1,
    marginLeft: 8,
  },
  fullscreenBottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  fullscreenProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    position: 'relative',
    marginBottom: 12,
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
  fullscreenTimeContainer: {
    alignItems: 'center',
  },
});
