import React from 'react';
import { render } from '@testing-library/react-native';
import { useForm } from 'react-hook-form';
import { InputSelectPaper } from '../InputSelectPaper';

const mockItems = [
  { label: 'Option 1', value: 'opt1' },
  { label: 'Option 2', value: 'opt2' },
  { label: 'Option 3', value: 'opt3' },
];

const TestWrapper = () => {
  const { control } = useForm({
    defaultValues: { testSelect: '' },
  });

  return (
    <InputSelectPaper
      control={control}
      name="testSelect"
      items={mockItems}
      placeholder="Select an option"
    />
  );
};

describe('InputSelectPaper', () => {
  it('should render without crashing', () => {
    const { toJSON } = render(<TestWrapper />);
    expect(toJSON()).toBeTruthy();
  });

  it('should render with items', () => {
    const { toJSON } = render(<TestWrapper />);
    const tree = toJSON();
    expect(tree).not.toBeNull();
  });
});
