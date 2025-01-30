import * as React from 'react'
import { Box, Container, Paper, SxProps, Theme, Typography, useMediaQuery, useTheme } from '@mui/material'
import { PageLoader } from './pages/PageLoader'
import { fontFamilies } from '../theme'

export interface TablePageWrapperProps {
  title?: string | React.ReactNode
  children: React.ReactNode
  loading?: boolean
  titleSx?: SxProps<Theme>
  bottomFixed?: React.ReactNode
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    border: {
      // sm: '1px solid red',
      // md: '1px solid green',
    },
  },
  paper: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    overflow: 'hidden',
    height: '100%',
    py: {
      xs: 0,
      sm: 2,
      md: 3,
      lg: 4,
    },
    pl: {
      xs: 2,
      sm: 2,
      md: 2,
      lg: 4,
    },
    pr: {
      xs: 0,
      sm: 0,
      md: 0,
      lg: 4,
    },
    my: {
      sm: 2,
      md: 4,
    },
    border: {
      // lg: '2px solid red',
      md: '1px solid #444444',
    },
    backgroundColor: '#09090bec',
    maxWidth: '2200px',
  },
}

export const TablePageWrapper: React.FC<TablePageWrapperProps> = ({
  title,
  children,
  loading,
  titleSx,
  bottomFixed,
}) => {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <Box
      id="TablePageWrapper"
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        overflowY: isSmall ? 'auto' : 'hidden',
        height: '100%',
      }}
    >
      <Paper
        elevation={4}
        sx={{
          ...styles.paper,
          position: 'relative',
          margin: isSmall ? '0' : 'auto',
        }}
      >
        {title && (
          <Container sx={{ ...styles.container, flexGrow: 0 }}>
            <Typography
              variant="h4"
              component="h1"
              fontFamily={fontFamilies.robotoMono}
              gutterBottom
              sx={{
                fontSize: {
                  xs: '1.5rem',
                  sm: '1.7rem',
                  md: '1.8rem',
                  lg: '2.5rem',
                },
                textAlign: 'center',
                py: {
                  xs: 1,
                  sm: 0,
                },
                color: theme.palette.primary.light,
                textShadow: `2px 2px 3px ${theme.palette.primary.contrastText}`,
                textTransform: 'capitalize',
                borderBottom: `2px solid ${theme.palette.primary.contrastText}`,
                ...(titleSx || {}),
              }}
            >
              {title}
            </Typography>
          </Container>
        )}
        <Box
          id="TablePageWrapperInner"
          sx={{
            ...styles.container,
            flexGrow: 1,
            //
            overflow: 'hidden',
            overflowY: isSmall ? 'visible' : 'hidden',
          }}
        >
          {children}
        </Box>
      </Paper>
      {bottomFixed}
      <PageLoader title="Loading..." loading={loading} />
    </Box>
  )
}
