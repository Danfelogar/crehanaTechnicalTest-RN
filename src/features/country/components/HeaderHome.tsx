import { StyleSheet, View } from 'react-native';
import { colors, TitleText, useCountriesStore } from '../../../shared';
import { IconButton } from 'react-native-paper';

export const HeaderHome = () => {
  const {
    //actions
    resetFilters,
  } = useCountriesStore();

  return (
    <View style={styles.header}>
      <TitleText size="large">Countries</TitleText>
      <View style={styles.headerActions}>
        <IconButton
          icon="magnify"
          size={24}
          iconColor={colors.onSurface}
          onPress={() => console.log('Search pressed')}
        />
        <IconButton
          icon="delete"
          size={24}
          iconColor={colors.error}
          onPress={resetFilters}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
