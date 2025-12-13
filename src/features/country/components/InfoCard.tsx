import { StyleSheet, View } from 'react-native';
import { BodyText, colors, isIOS, LabelText, TitleText } from '../../../shared';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { Surface } from 'react-native-paper';
import { ContinentTag } from './ContinentTag';

interface InfoCardProps {
  icon: string;
  iconColor: string;
  label: string;
  value: string;
  isTag?: boolean;
  continentCode?: string;
}

export const InfoCard = ({
  icon,
  iconColor,
  label,
  value,
  isTag,
  continentCode,
}: InfoCardProps) => (
  <View style={styles.card}>
    <View style={styles.cardIcon}>
      <MaterialIcons name={icon as any} size={24} color={iconColor} />
    </View>
    <View style={styles.cardContent}>
      <LabelText
        size={isIOS() ? 'large' : 'small'}
        color={isIOS() ? colors.onSurface : colors.onSurfaceVariant}
        style={styles.cardLabel}
      >
        {label}
      </LabelText>
      {isTag && continentCode ? (
        <ContinentTag continentCode={continentCode} continentName={value} />
      ) : isTag ? (
        <View style={styles.tag}>
          <BodyText size="medium" color={colors.primary}>
            {value}
          </BodyText>
        </View>
      ) : (
        <TitleText size="medium" color={colors.onSurface}>
          {value}
        </TitleText>
      )}
    </View>
  </View>
);

export const SkeletonInfoCard = () => (
  <Surface
    style={[styles.infoCardSkeleton, styles.skeletonShimmer]}
    mode="flat"
  >
    <View style={styles.skeletonIcon} />
    <View style={styles.skeletonContent}>
      <View style={[styles.skeletonText, { width: '40%', marginBottom: 8 }]} />
      <View style={[styles.skeletonText, { width: '60%' }]} />
    </View>
  </Surface>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: colors.surface,
  },
  backButton: {
    margin: 0,
  },
  videoContainer: {
    backgroundColor: '#FF8C00',
    aspectRatio: 16 / 9,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  videoPlayer: {
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
    width: '20%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    left: '20%',
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
  card: {
    flexDirection: 'row',
    gap: 16,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  cardLabel: {
    letterSpacing: 0.5,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  infoCardSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surfaceVariant,
  },
  skeletonShimmer: {
    overflow: 'hidden',
    position: 'relative',
  },
  skeletonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.outline,
    marginRight: 16,
  },
  skeletonContent: {
    flex: 1,
  },
  skeletonText: {
    height: 12,
    backgroundColor: colors.outline,
    borderRadius: 4,
  },
});
