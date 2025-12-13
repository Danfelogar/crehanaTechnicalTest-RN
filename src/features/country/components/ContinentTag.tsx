import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LabelText } from '../../../shared';

interface ContinentTagProps {
  continentCode: string;
  continentName: string;
  size?: 'small' | 'medium';
}

const continentColors = {
  AF: { bg: '#FEF3C7', text: '#92400E' }, // Africa
  AN: { bg: '#E0E7FF', text: '#3730A3' }, // Antarctica
  AS: { bg: '#FED7AA', text: '#9A3412' }, // Asia
  EU: { bg: '#DDD6FE', text: '#5B21B6' }, // Europe
  NA: { bg: '#DBEAFE', text: '#1E40AF' }, // North America
  OC: { bg: '#D1FAE5', text: '#065F46' }, // Oceania
  SA: { bg: '#D1FAE5', text: '#047857' }, // South America
};

export const ContinentTag = ({
  continentCode,
  continentName,
  size = 'medium',
}: ContinentTagProps) => {
  const colors = continentColors[
    continentCode as keyof typeof continentColors
  ] || {
    bg: '#F3F4F6',
    text: '#6B7280',
  };

  const paddingSize = size === 'small' ? 4 : 6;
  const fontSize = size === 'small' ? 'small' : 'medium';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.bg,
          paddingHorizontal: paddingSize + 4,
          paddingVertical: paddingSize,
        },
      ]}
    >
      <LabelText
        size={fontSize as any}
        style={{
          color: colors.text,
          fontWeight: '500',
        }}
      >
        {continentName}
      </LabelText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
});
