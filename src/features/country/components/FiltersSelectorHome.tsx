// components/FiltersSelectorHome.tsx
import { StyleSheet, View, ScrollView } from 'react-native';
import { colors, InputSelectPaper, widthFullScreen } from '../../../shared';
import { useFilters } from '../hooks';

export const FiltersSelectorHome = () => {
  const {
    //state
    control,
    isLoading,
    continentOptions,
    currencyOptions,
    //actions
    handleContinentChange,
    handleCurrencyChange,
  } = useFilters();

  return (
    <View style={styles.filtersContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        alwaysBounceHorizontal={false}
        overScrollMode="never"
        style={styles.scrollView}
      >
        <View style={styles.filterRow}>
          <View style={styles.filterItem}>
            <InputSelectPaper
              control={control}
              name="continent"
              items={continentOptions}
              placeholder="All Continents"
              mode="contained"
              onChangeCallback={handleContinentChange}
              buttonStyle={styles.continentButton}
              disabled={isLoading}
              style={styles.selector}
            />
          </View>

          <View style={styles.filterItem}>
            <InputSelectPaper
              control={control}
              name="currency"
              items={currencyOptions}
              placeholder="All Currencies"
              mode="elevated"
              onChangeCallback={handleCurrencyChange}
              disabled={isLoading}
              style={styles.selector}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '100%',
  },
  scrollView: {
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
    paddingVertical: 6,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
  },
  filterItem: {
    width: widthFullScreen * 0.52,
    minWidth: widthFullScreen * 0.52,
    flexShrink: 0,
  },
  selector: {
    width: '100%',
  },
  continentButton: {
    backgroundColor: colors.primaryLight,
  },
});
