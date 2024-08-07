import log from 'loglevel'
import React, { useEffect } from 'react'

import { Preview } from '@storybook/react'
import { ThemeProvider } from '@mui/system'
import { CssBaseline } from '@mui/material'
import { theme } from '../src/theme'
log.setLevel(log.levels.DEBUG)

const preview: Preview = {
  decorators: [
    (Story) => {
      useEffect(() => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href =
          'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap'
        document.querySelector('head')?.append(link)
      }, [])

      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Story />
        </ThemeProvider>
      )
    },
  ],

  tags: ['autodocs'],
}

export default preview
