import * as React from 'react'
import { Alert, Link, SxProps, Tab, Tabs, Theme, Typography, useTheme } from '@mui/material'
import { PageWrapper } from '../PageWrapper'
import { Calculate, Person } from '@mui/icons-material'
import { LoadoutCalc } from '../calculators/LoadoutCalc/LoadoutCalc'
import { LaserTable } from '../tables/LaserTable'
import { ModuleTable } from '../tables/ModuleTable'
import { LaserIcon } from '../../icons/Laser'
import { ModuleIcon } from '../../icons/Module'
import { MiningLoadout, UserProfile } from '@regolithco/common'
import log from 'loglevel'
import { MyLoadouts } from './MyLoadouts'

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  innerPaper: {
    p: 3,
    mb: 4,
  },
})

export interface LoadoutPageProps {
  tab: string
  isLoggedIn?: boolean
  loadouts: MiningLoadout[]
  loading?: boolean
  userProfile?: UserProfile
  activeLoadout?: string
  createLoadout?: (loadout: MiningLoadout) => Promise<void>
  updateLoadout?: (loadout: MiningLoadout) => Promise<void>
  deleteLoadout?: (loadoutId: string) => Promise<void>
  navigate?: (path: string) => void
}

export const LoadoutTabIndex = {
  Calculator: 'calculator',
  MyLoadouts: 'my',
  Lasers: 'lasers',
  Modules: 'modules',
}

export const LoadoutPage: React.FC<LoadoutPageProps> = ({
  navigate,
  tab,
  isLoggedIn,
  loading,
  loadouts,
  userProfile,
  activeLoadout,
  createLoadout,
  updateLoadout,
  deleteLoadout,
}) => {
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
        <Tab label="My Loadouts" icon={<Person />} value={LoadoutTabIndex.MyLoadouts} />
        <Tab label="Lasers" icon={<LaserIcon />} value={LoadoutTabIndex.Lasers} />
        <Tab label="Modules" icon={<ModuleIcon />} value={LoadoutTabIndex.Modules} />
      </Tabs>
      {finalTab === LoadoutTabIndex.Calculator && (
        <LoadoutCalc
          loading={loading}
          loadoutCount={loadouts.length}
          userProfile={userProfile}
          onCreate={(loadout) => {
            log.debug('Create loadout', loadout)
            createLoadout && createLoadout(loadout)
          }}
        />
      )}
      {finalTab === LoadoutTabIndex.MyLoadouts && !isLoggedIn && (
        <Alert severity="info">You must be logged in to save loadouts.</Alert>
      )}
      {finalTab === LoadoutTabIndex.MyLoadouts && isLoggedIn && userProfile && (
        <MyLoadouts
          loadouts={loadouts}
          loading={Boolean(loading)}
          activeLoadout={activeLoadout}
          onCloseDialog={() => {
            log.debug('Close dialog')
            navigate && navigate('/loadouts/my')
          }}
          onOpenDialog={(loadoutId) => {
            log.debug('Open dialog', loadoutId)
            navigate && navigate(`/loadouts/my/${loadoutId}`)
          }}
          onDeleteLoadout={(loadoutId) => {
            log.debug('Delete loadout', loadoutId)
            deleteLoadout && deleteLoadout(loadoutId)
          }}
          userProfile={userProfile}
          onUpdateLoadout={(loadout) => {
            log.debug('Save loadout', loadout)
            updateLoadout && updateLoadout(loadout)
          }}
        />
      )}
      {finalTab === LoadoutTabIndex.Lasers && (
        <LaserTable
          onAddToLoadout={(laser) => {
            // console.log('Add to loadout', laser)
          }}
        />
      )}
      {finalTab === LoadoutTabIndex.Modules && (
        <ModuleTable onAddToLoadout={(module) => console.log('Add to loadout', module)} />
      )}

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
