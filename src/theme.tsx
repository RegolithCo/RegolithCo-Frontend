import { grey, orange, purple, red, yellow } from '@mui/material/colors'
import { createTheme, PaletteOptions, ThemeOptions } from '@mui/material/styles'
import { Theme } from '@mui/material'
import { ScoutingFindStateEnum, WorkOrderStateEnum } from '@regolithco/common'

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
        'body *::-webkit-scrollbar': {
          display: 'none', // Safari and Chrome scrollbars turn off
        },
        'body *': {
          msOverflowStyle: 'none', // IE 10+ scrollbars turn off
          scrollbarWidth: 'none', // Firefox scrollbars turn off
        },
        html: {
          height: '100%',
        },
        body: {
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
