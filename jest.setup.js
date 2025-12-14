global.__DEV__ = true;

// Mock react-native PROPERLY with React components, not strings
jest.mock('react-native', () => {
  const React = require('react');

  const mockComponent = name => {
    const component = props => {
      return React.createElement(name, props, props.children);
    };
    component.displayName = name;
    return component;
  };

  return {
    Platform: {
      OS: 'ios',
      select: jest.fn(obj => obj.ios || obj.default),
    },
    Dimensions: {
      get: jest.fn(() => ({
        width: 375,
        height: 667,
        scale: 2,
        fontScale: 1,
      })),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    StyleSheet: {
      create: jest.fn(styles => styles),
      flatten: jest.fn(style => style),
    },
    View: mockComponent('View'),
    Text: mockComponent('Text'),
    TextInput: mockComponent('TextInput'),
    TouchableOpacity: mockComponent('TouchableOpacity'),
    ScrollView: mockComponent('ScrollView'),
    FlatList: mockComponent('FlatList'),
    Modal: mockComponent('Modal'),
    Image: mockComponent('Image'),
    Pressable: mockComponent('Pressable'),
    ActivityIndicator: mockComponent('ActivityIndicator'),
  };
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

// Mock react-native-vector-icons
jest.mock('@react-native-vector-icons/material-icons', () => ({
  MaterialIcons: 'MaterialIcons',
}));

jest.mock('@react-native-vector-icons/lucide', () => ({
  Lucide: 'Lucide',
}));

// Mock react-native-video
jest.mock('react-native-video', () => 'Video');

// Mock react-native-paper
jest.mock('react-native-paper', () => {
  const React = require('react');
  return {
    TextInput: Object.assign(
      ({
        value,
        onChangeText,
        onBlur,
        onFocus,
        label,
        placeholder,
        left,
        right,
        ...props
      }) => {
        const MockTextInput = require('react-native').TextInput;
        return React.createElement(MockTextInput, {
          value,
          onChangeText,
          onBlur,
          onFocus,
          placeholder,
          testID: 'text-input',
          ...props,
        });
      },
      {
        Icon: ({ icon, onPress, disabled }) => {
          const { View } = require('react-native');
          return React.createElement(View, { testID: `icon-${icon}` });
        },
      },
    ),
    Button: ({ children, onPress, ...props }) => {
      const { Text, TouchableOpacity } = require('react-native');
      return React.createElement(
        TouchableOpacity,
        { onPress, ...props },
        React.createElement(Text, {}, children),
      );
    },
    List: {
      Icon: ({ icon, color }) => {
        const { Text } = require('react-native');
        return React.createElement(Text, {}, icon);
      },
    },
    useTheme: () => ({
      colors: {
        onSurfaceDisabled: '#999',
        onSurface: '#000',
        primary: '#6200ee',
      },
    }),
    MD3LightTheme: {
      colors: {
        primary: '#6200ee',
        onSurface: '#000',
        onSurfaceDisabled: '#999',
        surface: '#fff',
        background: '#fff',
      },
    },
  };
});

// Generic Apollo Client mock
jest.mock('@apollo/client', () => {
  const mockLink = jest.fn().mockImplementation(fn => ({ request: fn }));
  mockLink.from = jest.fn(links => links[0] || {});

  return {
    __esModule: true,
    gql: jest.fn(strings => strings),
    ApolloClient: jest.fn().mockImplementation(() => ({
      query: jest.fn(),
      mutate: jest.fn(),
      watchQuery: jest.fn(),
    })),
    InMemoryCache: jest.fn(),
    HttpLink: jest.fn(),
    ApolloLink: mockLink,
    ApolloProvider: ({ children }) => children,
    useQuery: jest.fn(),
    useMutation: jest.fn(),
    useLazyQuery: jest.fn(),
  };
});
