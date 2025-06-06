import * as React from 'react'
import { Box, Theme, ThemeProvider } from '@mui/material'
import { ScoutingFind, ScoutingFindStateEnum } from '@regolithco/common'
import { scoutingFindStateThemes } from '../../theme'
import { ScoutingFindCalc } from '../calculators/ScoutingFindCalc'

export type ClusterShareSettings = {
  hideNames?: boolean
  hideAvatars?: boolean
}

export interface ClusterShareProps {
  scoutingFind: ScoutingFind
  settings?: ClusterShareSettings
}

// const workOrderStylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
//   container: {
//     [theme.breakpoints.up('md')]: {
//       flex: '1 1',
//     },
//   },
//   cardCss: {
//     border: `1px solid #444444`,
//     [theme.breakpoints.up('md')]: {
//       borderRadius: 2,
//       display: 'flex',
//       flexDirection: 'column',
//       height: '100%',
//       minHeight: 600,
//     },
//     [theme.breakpoints.down('sm')]: {
//       borderRadius: 0,
//       border: `None`,
//     },
//   },
//   gridCss: {
//     [theme.breakpoints.up('md')]: {
//       height: '100%',
//     },
//   },
// })

export const ClusterShare: React.FC<ClusterShareProps> = ({ scoutingFind, settings }) => {
  const [theme, setTheme] = React.useState<Theme>(
    scoutingFindStateThemes[scoutingFind.state || ScoutingFindStateEnum.Discovered]
  )

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ position: 'relative' }}>
        <ScoutingFindCalc scoutingFind={scoutingFind} isShare />
      </Box>
    </ThemeProvider>
  )
}
