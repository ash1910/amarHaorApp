import {extendTheme, theme} from 'native-base';

export const myTheme = extendTheme({
  colors: {
    primary: {
      ...theme.colors.green,
      300: '#BCECBA',
      500: '#02AB00',
    },
  },
  components: {
    Button: {
      baseStyle: {
        rounded: 'sm',
      },
      defaultProps: {
        size: 'lg',
        // _loading: {
        //   bg: 'amber.400:alpha.70',
        //   _text: {
        //     color: 'coolGray.700',
        //   },
        // },
        // _spinner: {
        //   color: 'green',
        // },
      },
      variants: {
        outline: {
          borderColor: 'primary.500',
        },
      },
    },
    Heading: {
      // Can pass also function, giving you access theming tools
      baseStyle: ({colorMode}) => {
        return {
          color: colorMode === 'dark' ? 'red.300' : 'dark.300',
          fontWeight: 'bold',
        };
      },
      defaultProps: {
        size: 'lg',
        paddingY: 5,
      },
    },
  },
});
