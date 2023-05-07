import * as React from 'react'
import { Box } from '@mui/material'
import { fontFamilies } from '../../theme'

export const SCVersion: React.FC = () => {
  return (
    <Box
      sx={{
        fontFamily: fontFamilies.robotoMono,
        // fontSize: 10,
      }}
    >
      <Box>Star Citizen V.3.19</Box>
    </Box>
  )
}
