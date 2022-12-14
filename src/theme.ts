import { red, yellow } from '@mui/material/colors'
import { createTheme, ThemeOptions } from '@mui/material/styles'

export const darkOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: red,
    secondary: yellow,
    text: {
      primary: '#FFa',
      secondary: '#bFF',
    },
  },
}

// A custom theme for this app
export const theme = createTheme(darkOptions)
