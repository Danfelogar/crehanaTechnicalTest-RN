import { View, StyleSheet } from 'react-native';
import { BodyText, colors, InputGeneric } from '../../../shared';
import { useFilteredCountries, useSearchSync } from '../..';

interface SearchCountriesProps {
  placeholder?: string;
  label?: string;
}

export const SearchCountries = ({
  placeholder = 'Search countries...',
  label = '',
}: SearchCountriesProps) => {
  const { control } = useSearchSync();
  const filteredCountries = useFilteredCountries();

  return (
    <View style={styles.container}>
      <InputGeneric
        control={control}
        name="searchCountry"
        label={label}
        placeholder={placeholder}
        leftIcon="magnify"
        mode="outlined"
        autoCorrect={false}
        autoCapitalize="words"
        outlineColor={colors.outline}
        activeOutlineColor={colors.primary}
        style={styles.input}
      />
      <BodyText size="medium" color={colors.onSurfaceVariant}>
        {filteredCountries?.length ?? 0} result
        {filteredCountries?.length !== 1 ? 's' : ''} found
      </BodyText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    marginBottom: 12,
  },
});
