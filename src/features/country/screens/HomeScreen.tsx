import { useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import {
  colors,
  RootStackMainParams,
  StandardWrapper,
  useCountriesStore,
} from '../../../shared';
import {
  CountryCard,
  EmptyState,
  FiltersSelectorHome,
  HeaderHome,
  RenderLoadingSkeleton,
  SearchCountries,
} from '../components';
import { useFilteredCountries } from '../hooks';

interface Props extends StackScreenProps<RootStackMainParams, 'Home'> {}

export const HomeScreen = ({ navigation }: Props) => {
  const {
    //states
    isLoading,
    isInitialized,
    //actions
    resetFilters,
    fetchAllData,
  } = useCountriesStore();
  const filteredCountries = useFilteredCountries();

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return (
    <StandardWrapper>
      <View style={styles.container}>
        <HeaderHome />
        <SearchCountries />
        <FiltersSelectorHome />
        <View style={styles.listContainer}>
          {isLoading && !isInitialized && <RenderLoadingSkeleton />}
          {!isLoading && isInitialized && (
            <FlatList
              data={filteredCountries}
              style={styles.flatListWrapper}
              keyExtractor={item => item.code}
              renderItem={({ item }) => (
                <CountryCard
                  country={item}
                  onPress={() =>
                    navigation.navigate('Details', { code: item.code })
                  }
                />
              )}
              contentContainerStyle={styles.flatListContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={<EmptyState onReset={resetFilters} />}
            />
          )}
        </View>
      </View>
    </StandardWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContainer: {
    flexGrow: 1,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2.5,
    elevation: 4,
    paddingTop: 2,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
  },
  flatListContent: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  flatListWrapper: { flex: 1, paddingBottom: 20 },
});
