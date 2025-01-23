import * as React from 'react'
import { Box, Breakpoint, Container, Paper, SxProps, Typography } from '@mui/material'
import { PageLoader } from './pages/PageLoader'
import { margin, Theme, useTheme } from '@mui/system'
import { fontFamilies } from '../theme'

export interface TablePageWrapperProps {
  title?: string | React.ReactNode
  children: React.ReactNode
  maxWidth?: false | Breakpoint | undefined
  loading?: boolean
  sx?: SxProps<Theme>
  titleSx?: SxProps<Theme>
}

const styles = {
  container: {
    border: {
      // sm: '1px solid red',
      // md: '1px solid green',
    },
    pr: {
      xs: 0,
      sm: 0,
      md: 3,
    },
    pl: {
      xs: 0,
      sm: 0,
      md: 3,
    },
  },
  paper: {
    py: {
      xs: 0,
      sm: 2,
      md: 3,
      lg: 4,
    },
    px: {
      xs: 2,
      sm: 2,
      md: 2,
      lg: 4,
    },
    my: {
      md: 4,
    },
    border: {
      md: '1px solid #444444',
    },
    backgroundColor: '#09090bec',
    maxWidth: '90%',
    margin: 'auto',
  },
}

export const TablePageWrapper: React.FC<TablePageWrapperProps> = ({
  title,
  children,
  maxWidth,
  loading,
  sx,
  titleSx,
}) => {
  const theme = useTheme()
  return (
    <>
      <Paper elevation={4} sx={styles.paper}>
        <Container maxWidth={'lg'} sx={{ ...styles.container, ...sx }}>
          {title && (
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
                  xs: 3,
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
          )}
        </Container>
        <Box sx={{ ...styles.container, ...sx }}>{children}</Box>
      </Paper>
      <PageLoader title="Loading..." loading={loading} />
    </>
  )
}
