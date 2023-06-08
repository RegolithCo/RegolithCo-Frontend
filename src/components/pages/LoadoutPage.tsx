import * as React from 'react'
import { Box, Link, SxProps, Tab, Tabs, Theme, Typography, useTheme } from '@mui/material'
import { PageWrapper } from '../PageWrapper'
import { Celebration, Coffee, HelpCenter, Info, QuestionAnswer } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { useLogin } from '../../hooks/useOAuth2'
import { LaserTable } from '../calculators/LoadoutCalc/LaserTable'

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  innerPaper: {
    p: 3,
    mb: 4,
  },
})

export const AboutPageContainer: React.FC = () => {
  const navigate = useNavigate()
  const { isInitialized } = useLogin()
  const { tab } = useParams()

  return <LoadoutPage navigate={navigate} tab={tab as string} isLoggedIn={isInitialized} />
}

export interface LoadoutPageProps {
  tab: string
  isLoggedIn?: boolean
  navigate?: (path: string) => void
}

export const LoadoutTabIndex = {
  Calculator: 'tables',
  MyLoadouts: 'my',
}

export const LoadoutPage: React.FC<LoadoutPageProps> = ({ navigate, tab, isLoggedIn }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)

  const finalTab = typeof tab === 'undefined' ? LoadoutTabIndex.Calculator : tab

  return (
    <PageWrapper title="About Regolith Co." maxWidth="sm" sx={{ marginLeft: { lg: '7%' } }}>
      <Typography variant="body2" component="div" gutterBottom>
        <em>"Don't mine alone"</em>
      </Typography>
      <Tabs
        value={finalTab}
        aria-label="basic tabs example"
        sx={{ mb: 3 }}
        onChange={(event, newValue) => {
          navigate && navigate(`/about/${newValue}`)
        }}
      >
        <Tab label="Calculator" icon={<Info />} value={LoadoutTabIndex.Calculator} />
        <Tab label="My Loadouts" disabled={!isLoggedIn} icon={<QuestionAnswer />} value={LoadoutTabIndex.MyLoadouts} />
      </Tabs>
      {finalTab === LoadoutTabIndex.Calculator && (
        <Box sx={{ mb: 3 }}>
          <LaserTable />
        </Box>
      )}
      {finalTab === LoadoutTabIndex.MyLoadouts && <Box sx={{ mb: 3 }}>Put My stuff here</Box>}
    </PageWrapper>
  )
}
