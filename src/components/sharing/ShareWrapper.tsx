import { Box, Typography, useTheme } from '@mui/material'
import { SxProps, Theme } from '@mui/system'
import React from 'react'

const styles: Record<string, SxProps<Theme>> = {
  container: {
    flex: '1 1',
    margin: 0,
    overflow: 'hidden',
  },
  overlay: {
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
  },
}

export const ShareWrapper = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const theme = useTheme()
  return (
    <Box
      sx={{
        ...styles.container,
        backgroundImage: {
          // md: `url('${process.env.PUBLIC_URL}/images/bg/${bgImageFinal}')`,
        },
      }}
    >
      <Box sx={styles.overlay}>{children}</Box>
      <Box>
        <Typography
          variant="body2"
          component="div"
          color="primary"
          align="center"
          sx={{
            fontSize: 14,
          }}
        >
          Made Using Regolith: https://regolith.rocks
        </Typography>
      </Box>
    </Box>
  )
}
