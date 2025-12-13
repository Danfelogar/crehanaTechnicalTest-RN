import Video from 'react-native-video';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { ActivityIndicator, IconButton } from 'react-native-paper';
import { InfoCard, SkeletonInfoCard } from '../components';
import { useDetailsCountry } from '../hooks';
import {
  BodyText,
  colors,
  LabelText,
  RootStackMainParams,
  StandardWrapper,
  TitleText,
} from '../../../shared';
import { useRef } from 'react';

const iconMapping = {
  countryCode: 'tag',
  capital: 'location-on',
  continent: 'public',
  currency: 'attach-money',
  language: 'translate',
  play: 'play-arrow',
  pause: 'pause',
  fullscreen: 'fullscreen',
  back: 'arrow-back',
};

interface Props extends StackScreenProps<RootStackMainParams, 'Details'> {}

export const DetailsScreen = ({ route, navigation }: Props) => {
  const { code } = route.params;
  const progressBarRef = useRef<View>(null);

  const {
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
  } = useDetailsCountry({ code });

  const handleProgressBarPress = (event: any) => {
    if (!progressBarRef.current) return;

    progressBarRef.current.measure((_x, _y, width, _height, _pageX, _pageY) => {
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
    });
  };

  return (
    <StandardWrapper>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            iconColor={colors.onSurface}
            size={24}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />

          {isLoading ? (
            <View style={styles.titleSkeletonContainer}>
              <View style={[styles.skeletonText, styles.titleSkeleton]} />
            </View>
          ) : (
            <TitleText size="large" color={colors.onSurface}>
              {singleCountry?.country.name} {singleCountry?.country.emoji}
            </TitleText>
          )}

          <View style={{ width: 24, height: 24 }} />
        </View>

        {isLoading ? (
          <SkeletonVideoPlayer />
        ) : (
          <View style={styles.videoContainer}>
            <Video
              ref={videoRef}
              source={{
                uri: selectedVideo.uri,
                // BufferConfig movido aquí (no deprecated)
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

            {/* Overlay de controles */}
            <Pressable style={styles.videoOverlay} onPress={handlePlayPause}>
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
            </Pressable>

            {/* Barra de progreso y controles */}
            <View style={styles.progressContainer}>
              <Pressable
                ref={progressBarRef}
                style={styles.progressBar}
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
                onPress={() => {
                  // Implementar fullscreen si es necesario
                  console.log('Fullscreen pressed');
                }}
              />
            </View>
          </View>
        )}

        <View style={styles.infoSection}>
          <TitleText
            size="medium"
            color={colors.onSurface}
            style={styles.sectionTitle}
          >
            Country Information
          </TitleText>
          <BodyText
            size="small"
            color={colors.onSurfaceVariant}
            style={styles.sectionSubtitle}
          >
            {isLoading ? 'Loading details...' : 'Key details and geography.'}
          </BodyText>

          <View style={styles.infoCards}>
            {isLoading ? (
              <>
                <SkeletonInfoCard />
                <SkeletonInfoCard />
                <SkeletonInfoCard />
                <SkeletonInfoCard />
                <SkeletonInfoCard />
              </>
            ) : (
              <>
                <InfoCard
                  icon={iconMapping.countryCode}
                  iconColor={colors.primary}
                  label="COUNTRY CODE"
                  value={singleCountry?.country.code || 'Loading...'}
                />

                <InfoCard
                  icon={iconMapping.capital}
                  iconColor={colors.primary}
                  label="CAPITAL"
                  value={singleCountry?.country.capital || 'Not Found...'}
                />

                <InfoCard
                  icon={iconMapping.continent}
                  iconColor={colors.primary}
                  label="CONTINENT"
                  value={
                    singleCountry?.country.continent.name || 'Not Found...'
                  }
                  continentCode={singleCountry?.country.continent.code}
                  isTag
                />

                <InfoCard
                  icon={iconMapping.currency}
                  iconColor={colors.primary}
                  label="CURRENCY"
                  value={singleCountry?.country.currency || 'Not Found...'}
                />

                <InfoCard
                  icon={iconMapping.language}
                  iconColor={colors.primary}
                  label="LANGUAGE"
                  value={
                    singleCountry?.country.languages
                      .map(lang => lang.name)
                      .join(', ') || 'Not Found...'
                  }
                />
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </StandardWrapper>
  );
};

const SkeletonVideoPlayer = () => (
  <View style={[styles.videoContainer, styles.skeletonShimmer]}>
    <ActivityIndicator
      size="large"
      color={colors.onPrimary}
      style={styles.videoSkeletonLoader}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: colors.surface,
  },
  backButton: {
    margin: 0,
  },
  titleSkeletonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSkeleton: {
    height: 32,
    width: 200,
    borderRadius: 8,
    backgroundColor: colors.surfaceVariant,
  },
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
  videoSkeletonLoader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
  infoSection: {
    backgroundColor: colors.surface,
    marginTop: 8,
    padding: 20,
    paddingBottom: 32,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  sectionSubtitle: {
    marginBottom: 24,
  },
  infoCards: {
    gap: 16,
  },
  skeletonShimmer: {
    overflow: 'hidden',
    position: 'relative',
  },
  skeletonText: {
    height: 12,
    backgroundColor: colors.outline,
    borderRadius: 4,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  seekingText: {
    marginTop: 8,
  },
});
