import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { Lucide } from '@react-native-vector-icons/lucide';
import { useAppTheme } from '../../../shared/theme';
import { BodyText, TitleText } from '../../../shared';

interface EmptyStateProps {
  onReset?: () => void;
}

export const EmptyState = ({ onReset }: EmptyStateProps) => {
  const theme = useAppTheme();

  return (
    <View style={emptyStyles.container}>
      <View
        style={[
          emptyStyles.iconContainer,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <Lucide
          name="search-x"
          size={64}
          color={theme.colors.onSurfaceVariant}
        />
      </View>

      <TitleText size="large" style={emptyStyles.title}>
        No countries found
      </TitleText>

      <BodyText
        size="medium"
        color={theme.colors.onSurfaceVariant}
        style={emptyStyles.subtitle}
      >
        Try adjusting your filters
      </BodyText>

      {onReset && (
        <Button
          mode="contained"
          onPress={onReset}
          style={emptyStyles.button}
          contentStyle={emptyStyles.buttonContent}
        >
          Reset filters
        </Button>
      )}
    </View>
  );
};

const emptyStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    borderRadius: 24,
    minWidth: 180,
  },
  buttonContent: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
});
