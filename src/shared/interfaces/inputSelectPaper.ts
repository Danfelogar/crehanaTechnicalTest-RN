import { Control, FieldValues } from 'react-hook-form';
import { StyleProp, ViewStyle } from 'react-native';

export interface InputSelectPaperProps<T extends FieldValues> {
  name: string;
  control: Control<T, any>;
  items: Array<{ label: string; value: string }>;
  placeholder?: string;
  mode?: 'outlined' | 'contained' | 'text' | 'elevated' | 'contained-tonal';
  icon?: string;
  style?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  onChangeCallback?: (value: string) => void;
}
