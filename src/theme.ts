import { blue, grey, indigo, orange, purple, yellow } from '@mui/material/colors'
import { createTheme, PaletteOptions, ThemeOptions } from '@mui/material/styles'
import { Theme } from '@mui/material'
import { ScoutingFindStateEnum } from '@regolithco/common'

declare module '@mui/material/styles' {
  interface TypographyVariants {
    tablecell: React.CSSProperties
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    tablecell?: React.CSSProperties
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    tablecell: true
  }
}

export const fontFamilies = {
  robotoMono: 'Roboto Mono, Courier New,Courier,Lucida Sans Typewriter,Lucida Typewriter,monospace',
}

export const darkOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: yellow,
    secondary: orange,
    text: {
      // primary: '#FFFFAA',
      // secondary: '#BBFFFF',
    },
  },
  typography: {
    tablecell: {
      fontWeight: 'bold',
      fontFamily: fontFamilies.robotoMono,
      lineHeight: 1,
      fontSize: 14,
    },
  },
  components: {
    MuiChip: {
      defaultProps: {
        sx: { borderRadius: 2 },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
            WebkitAppearance: 'none',
            margin: 0,
          },
          'input[type=number]': {
            MozAppearance: 'textfield',
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        'body>#root': {
          height: '100%',
        },
        html: {
          height: '100%',
        },
        body: {
          height: '100%',
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          tablecell: 'span',
        },
      },
    },
    MuiPaper: {
      defaultProps: {},
      styleOverrides: {
        root: {},
      },
    },
  },
}

// A custom theme for this app
export const theme = createTheme(darkOptions)

const scoutingFindStateColors: Record<ScoutingFindStateEnum, PaletteOptions> = {
  [ScoutingFindStateEnum.Abandonned]: {
    primary: grey,
    secondary: orange,
  },
  [ScoutingFindStateEnum.Depleted]: {
    primary: grey,
    secondary: orange,
  },
  [ScoutingFindStateEnum.Discovered]: {
    primary: { main: 'rgb(181, 206, 255)' },
    secondary: orange,
  },
  [ScoutingFindStateEnum.ReadyForWorkers]: {
    primary: yellow,
    secondary: orange,
  },
  [ScoutingFindStateEnum.Working]: {
    primary: { main: purple[200] },
    secondary: orange,
  },
}

export const scoutingFindStateThemes: Record<ScoutingFindStateEnum, Theme> = Object.entries(
  scoutingFindStateColors
).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [key]: createTheme({
      ...darkOptions,
      palette: {
        ...darkOptions.palette,
        ...value,
      },
    }),
  }),
  {} as Record<ScoutingFindStateEnum, Theme>
)
