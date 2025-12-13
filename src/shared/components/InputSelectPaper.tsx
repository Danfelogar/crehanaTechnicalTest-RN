import React, { useState, useCallback } from 'react';
import { Controller, FieldValues, Path } from 'react-hook-form';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Button, useTheme, List } from 'react-native-paper';
import { colors } from '../theme';
import { InputSelectPaperProps } from '../interfaces';
import { heightFullScreen, widthFullScreen } from '../utils';

export function InputSelectPaper<T extends FieldValues>({
  name,
  control,
  items,
  placeholder = 'Select an option',
  mode = 'outlined',
  icon = 'chevron-down',
  style,
  buttonStyle,
  disabled = false,
  onChangeCallback,
}: InputSelectPaperProps<T>) {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();
  const { height: screenHeight } = Dimensions.get('window');

  const openMenu = useCallback(() => setVisible(true), []);
  const closeMenu = useCallback(() => setVisible(false), []);

  return (
    <Controller
      control={control}
      name={name as Path<T>}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectedItem = items.find(item => item.value === value);
        const displayValue = selectedItem?.label || placeholder;

        const handleSelect = (itemValue: string) => {
          onChange(itemValue);
          onChangeCallback?.(itemValue);
          closeMenu();
        };

        return (
          <View style={[styles.container, style]}>
            <Button
              mode={mode}
              onPress={openMenu}
              disabled={disabled}
              icon={icon}
              contentStyle={[
                styles.buttonContent,
                mode === 'outlined' && styles.outlinedButton,
                buttonStyle,
              ]}
              style={[styles.button, error && styles.buttonError]}
              labelStyle={[
                styles.buttonLabel,
                !selectedItem && styles.placeholderLabel,
              ]}
              textColor={
                !selectedItem
                  ? theme.colors.onSurfaceDisabled
                  : theme.colors.onSurface
              }
            >
              {displayValue}
            </Button>

            <Modal
              visible={visible}
              transparent
              animationType="fade"
              onRequestClose={closeMenu}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={closeMenu}
              >
                <View style={styles.modalContent}>
                  <ScrollView
                    style={[
                      styles.modalScrollView,
                      { maxHeight: screenHeight * 0.6 },
                    ]}
                    nestedScrollEnabled
                  >
                    {items.map(item => (
                      <TouchableOpacity
                        key={item.value}
                        style={[
                          styles.modalItem,
                          value === item.value && styles.selectedItem,
                        ]}
                        onPress={() => handleSelect(item.value)}
                      >
                        <Text
                          style={[
                            styles.modalItemText,
                            value === item.value && styles.selectedItemText,
                          ]}
                        >
                          {item.label}
                        </Text>
                        {value === item.value && (
                          <List.Icon icon="check" color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    width: '100%',
  },
  buttonContent: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  outlinedButton: {
    paddingVertical: 4,
  },
  buttonLabel: {
    fontSize: 16,
    textAlign: 'left',
    flex: 1,
  },
  placeholderLabel: {
    fontWeight: '400',
  },
  buttonError: {
    borderColor: colors.error,
  },
  menuContainer: {
    position: 'absolute',
  },
  menuContent: {
    backgroundColor: '#FFFFFF',
    maxHeight: widthFullScreen * 0.98,
    width: widthFullScreen * 0.6,
    padding: 0,
  },
  scrollView: {
    maxHeight: heightFullScreen * 0.6,
  },
  selectedItem: {
    backgroundColor: colors.primaryLight,
  },
  selectedItemText: {
    fontWeight: '600',
    color: colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: '80%',
    maxWidth: 400,
  },
  modalScrollView: {
    borderRadius: 8,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemText: {
    fontSize: 16,
    flex: 1,
  },
});
