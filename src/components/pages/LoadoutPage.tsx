import * as React from 'react'
import { Box, Link, SxProps, Tab, Tabs, Theme, Typography, useTheme } from '@mui/material'
import { PageWrapper } from '../PageWrapper'
import { BorderAll, Calculate, Info, Person, QuestionAnswer } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { useLogin } from '../../hooks/useOAuth2'
import { LoadoutCalc } from '../calculators/LoadoutCalc/LoadoutCalc'
import { LaserTable } from '../tables/LaserTable'
import { ModuleTable } from '../tables/ModuleTable'

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  innerPaper: {
    p: 3,
    mb: 4,
  },
})

export const LoadoutPageContainer: React.FC = () => {
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
  Calculator: 'calculator',
  MyLoadouts: 'my',
  Lasers: 'lasers',
  Modules: 'modules',
}

export const LoadoutPage: React.FC<LoadoutPageProps> = ({ navigate, tab, isLoggedIn }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)

  const finalTab = typeof tab === 'undefined' ? LoadoutTabIndex.Calculator : tab

  return (
    <PageWrapper title="Mining Loadout" maxWidth="xl">
      <Tabs
        value={finalTab}
        sx={{ mb: 3 }}
        onChange={(event, newValue) => {
          navigate && navigate(`/loadouts/${newValue}`)
        }}
      >
        <Tab label="Calculator" icon={<Calculate />} value={LoadoutTabIndex.Calculator} />
        <Tab label="My Loadouts" disabled={!isLoggedIn} icon={<Person />} value={LoadoutTabIndex.MyLoadouts} />
        <Tab label="Lasers" icon={<BorderAll />} value={LoadoutTabIndex.Lasers} />
        <Tab label="Modules" icon={<BorderAll />} value={LoadoutTabIndex.Modules} />
      </Tabs>
      {finalTab === LoadoutTabIndex.Calculator && <LoadoutCalc />}
      {finalTab === LoadoutTabIndex.Lasers && (
        <LaserTable
          onAddToLoadout={(laser) => {
            console.log('Add to loadout', laser)
          }}
        />
      )}
      {finalTab === LoadoutTabIndex.Modules && (
        <ModuleTable onAddToLoadout={(module) => console.log('Add to loadout', module)} />
      )}
      {finalTab === LoadoutTabIndex.MyLoadouts && <Box sx={{ mb: 3 }}>Put My stuff here</Box>}

      <Typography variant="caption">
        Big thanks to{' '}
        <Link href="https://redmonstergaming.com/" target="_blank">
          RedMonsterSC
        </Link>{' '}
        for compiling the{' '}
        <Link href="https://redmonstergaming.com/" target="_blank">
          original spreadsheet
        </Link>{' '}
        with this data.
      </Typography>
    </PageWrapper>
  )
}
