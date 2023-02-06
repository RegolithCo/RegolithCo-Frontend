import * as React from 'react'
import { Box } from '@mui/material'
import { fontFamilies } from '../../theme'

interface SCVersionProps {
  semver: string
}

export const SCVersion: React.FC<SCVersionProps> = ({ semver }) => {
  return (
    <Box
      sx={{
        fontFamily: fontFamilies.robotoMono,
        fontSize: 10,
        mx: 2,
        textAlign: 'left',
        fontWeight: 'bold',
      }}
    >
      <Box>Star Citizen V.{semver}</Box>
    </Box>
  )
}
