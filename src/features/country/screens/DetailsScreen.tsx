import { ScrollView, StyleSheet, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { ActivityIndicator, IconButton } from 'react-native-paper';
import {
  InfoCard,
  MiniVideoContainer,
  ModalFullVideo,
  SkeletonInfoCard,
} from '../components';
import { useDetailsCountry } from '../hooks';
import {
  BodyText,
  colors,
  RootStackMainParams,
  StandardWrapper,
  TitleText,
} from '../../../shared';

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

  const {
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
    handleLoad,
    handleProgress,
    handleBuffer,
    handleSeekComplete,
    handleProgressBarPress,
    toggleFullscreen,
    handleVideoPress,
    handleScreenTouch,
  } = useDetailsCountry({ code });

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
          <MiniVideoContainer
            duration={duration}
            videoRef={videoRef}
            isPlaying={isPlaying}
            isSeeking={isSeeking}
            currentTime={currentTime}
            isBuffering={isBuffering}
            showControls={showControls}
            isFullscreen={isFullscreen}
            selectedVideo={selectedVideo}
            progressBarRef={progressBarRef}
            progressPercentage={progressPercentage}
            formatTime={formatTime}
            handleLoad={handleLoad}
            handleBuffer={handleBuffer}
            handleProgress={handleProgress}
            handleVideoPress={handleVideoPress}
            toggleFullscreen={toggleFullscreen}
            handleSeekComplete={handleSeekComplete}
            handleProgressBarPress={handleProgressBarPress}
          />
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

      <ModalFullVideo
        videoRef={videoRef}
        duration={duration}
        isPlaying={isPlaying}
        isSeeking={isSeeking}
        currentTime={currentTime}
        isBuffering={isBuffering}
        showControls={showControls}
        isFullscreen={isFullscreen}
        selectedVideo={selectedVideo}
        progressPercentage={progressPercentage}
        fullscreenProgressBarRef={fullscreenProgressBarRef}
        handleLoad={handleLoad}
        formatTime={formatTime}
        handleBuffer={handleBuffer}
        handleProgress={handleProgress}
        handleVideoPress={handleVideoPress}
        toggleFullscreen={toggleFullscreen}
        handleScreenTouch={handleScreenTouch}
        handleSeekComplete={handleSeekComplete}
        handleProgressBarPress={handleProgressBarPress}
      />
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
  videoSkeletonLoader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
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
});
