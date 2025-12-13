import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Card } from 'react-native-paper';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { ContinentTag } from './ContinentTag';

import { colors, useAppTheme } from '../../../shared/theme';
import { Country } from '../model';
import {
  BodyText,
  LabelText,
  TitleText,
  widthFullScreen,
} from '../../../shared';

interface CountryCardProps {
  country: Country;
  onPress?: (country: Country) => void;
}

export const CountryCard = ({ country, onPress }: CountryCardProps) => {
  const theme = useAppTheme();

  const handlePress = () => {
    onPress?.(country);
  };

  return (
    <Card
      style={[cardStyles.card, { backgroundColor: theme.colors.surface }]}
      elevation={1}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handlePress}
        style={cardStyles.touchable}
      >
        <Card.Content style={cardStyles.content}>
          <View style={cardStyles.flagContainer}>
            <View style={cardStyles.wrapperIcon}>
              <BodyText
                size="large"
                style={{
                  fontSize: widthFullScreen * 0.1,
                  lineHeight: widthFullScreen * 0.1,
                }}
              >
                {country.emoji}
              </BodyText>
            </View>
          </View>

          <View style={cardStyles.infoContainer}>
            <View style={cardStyles.nameRow}>
              <TitleText size="medium" numberOfLines={1}>
                {country.name}
              </TitleText>
              <LabelText
                size="large"
                color={theme.colors.onSurface}
                style={{ marginLeft: 8 }}
              >
                {country.code}
              </LabelText>
            </View>

            <View style={cardStyles.tagRow}>
              <ContinentTag
                continentCode={country.continent.code}
                continentName={country.continent.name}
              />
            </View>
          </View>

          <View style={cardStyles.chevronContainer}>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={theme.colors.onSurfaceVariant}
            />
          </View>
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );
};

export const CountryCardSkeleton = () => {
  const theme = useAppTheme();

  return (
    <Card
      style={[cardStyles.card, { backgroundColor: theme.colors.surface }]}
      elevation={1}
    >
      <Card.Content style={cardStyles.content}>
        <View style={cardStyles.flagContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>

        <View style={[cardStyles.infoContainer, { opacity: 0.5 }]}>
          <View style={cardStyles.skeletonContainer} />
          <View style={cardStyles.skeletonSecondary} />
        </View>
      </Card.Content>
    </Card>
  );
};

const cardStyles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 16,
  },
  touchable: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  flagContainer: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
  },
  chevronContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  skeletonContainer: {
    width: '60%',
    height: 20,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonSecondary: {
    width: 100,
    height: 24,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 8,
  },
  wrapperIcon: {
    flexDirection: 'row',
    height: widthFullScreen * 0.17,
    width: widthFullScreen * 0.17,
    borderRadius: (widthFullScreen * 0.17) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
