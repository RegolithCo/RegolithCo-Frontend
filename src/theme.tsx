import { grey, orange, purple } from '@mui/material/colors'
import { createTheme, PaletteOptions, ThemeOptions } from '@mui/material/styles'
import { Theme } from '@mui/material'
import { ScoutingFindStateEnum, WorkOrderStateEnum } from '@regolithco/common'
import { CSSObject } from '@emotion/react'

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
    primary: { main: '#fbc02d' },
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
        // For Firefox
        body: {
          height: '100%',
        },
        html: {
          height: '100%',
        },
        // This is our app container
        'body>#root': {
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
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
// Scrollbars
// https://css-tricks.com/custom-scrollbars-in-webkit/
if (darkOptions.components?.MuiCssBaseline) {
  const tempTheme = createTheme(darkOptions)
  const scrollBarThumbColor = tempTheme.palette?.error?.main || '#6c0b0b'
  const scrollBarBackground = tempTheme.palette?.background.default || '#44444422'
  const scrollBarBorderRadius = '10px'

  darkOptions.components.MuiCssBaseline.styleOverrides = {
    ...(darkOptions.components.MuiCssBaseline.styleOverrides as CSSObject),
    body: {
      height: '100%',
      // scrollbarWidth: 'thin', // Can be 'auto', 'thin', or 'none'
      // scrollbarColor: `${tempTheme.palette?.error?.dark || 'red'} ${
      //   tempTheme.palette?.background.default || '#44444444'
      // }`, // thumb and track color
      // scrollbars: {
      //   width: '32px', // Adjust scrollbar width
      //   height: '32px', // Adjust scrollbar height for horizontal scrollbars
      //   borderRadius: '16px', // Adjust for rounded corners
      // },
    },
    '::-webkit-scrollbar': {
      width: '10px', // Adjust scrollbar width
      height: '10px', // Adjust scrollbar height for horizontal scrollbars
      borderRadius: scrollBarBorderRadius, // Adjust for rounded corners
    },
    '::-webkit-scrollbar-track': {
      background: scrollBarBackground, // Scrollbar track color
      borderRadius: scrollBarBorderRadius, // Adjust for rounded corners
    },
    '::-webkit-scrollbar-thumb': {
      backgroundColor: scrollBarThumbColor, // Scrollbar thumb color
      borderRadius: scrollBarBorderRadius, // Adjust for rounded corners
      border: `2px solid ${scrollBarBackground}`, // Optional: Adds some space between the thumb and the track
    },
  }
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
    primary: { main: '#fbc02d' },
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

const workOrderStateColors: Record<WorkOrderStateEnum, PaletteOptions> = {
  [WorkOrderStateEnum.Done]: {},
  [WorkOrderStateEnum.Failed]: {
    primary: { main: '#ff8e77' },
    secondary: { main: '#ff8e77' },
  },
  [WorkOrderStateEnum.RefiningComplete]: {},
  [WorkOrderStateEnum.RefiningStarted]: {},
  [WorkOrderStateEnum.Unknown]: {},
}

export const workOrderStateThemes: Record<WorkOrderStateEnum, Theme> = Object.entries(workOrderStateColors).reduce(
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
  {} as Record<WorkOrderStateEnum, Theme>
)
