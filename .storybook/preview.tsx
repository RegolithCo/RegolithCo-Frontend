import log from 'loglevel'
import React, { useEffect } from 'react'

import { Preview } from '@storybook/react'
import { ThemeProvider } from '@mui/system'
import { CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { theme } from '../src/theme'
import { AppContextWrapper } from '../src/context/app.context'
import { LookupsContextWrapper } from '../src/context/lookupsContext'
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
          <SnackbarProvider autoHideDuration={1300} maxSnack={4}>

            <CssBaseline />
            <AppContextWrapper>
              <LookupsContextWrapper>
                <Story />
              </LookupsContextWrapper>
            </AppContextWrapper>
          </SnackbarProvider>
        </ThemeProvider>
      )
    },
  ],

  tags: ['autodocs'],
}

export default preview
