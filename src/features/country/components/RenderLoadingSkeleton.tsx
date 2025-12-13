import { StyleSheet, View } from 'react-native';
import { CountryCardSkeleton } from './CountryCard';
import { colors, SKELETON_ARRAY } from '../../../shared';

export const RenderLoadingSkeleton = () => (
  <View style={styles.listContainer}>
    {SKELETON_ARRAY.map(item => (
      <CountryCardSkeleton key={`skeleton-${item}`} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    width: '100%',
    paddingTop: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
  },
});
