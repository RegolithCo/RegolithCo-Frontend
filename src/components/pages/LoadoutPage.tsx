import * as React from 'react'
import {
  Alert,
  Box,
  IconButton,
  Link,
  Modal,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { PageWrapper } from '../PageWrapper'
import { Calculate, Close, Fullscreen, Person } from '@mui/icons-material'
import { LoadoutCalc } from '../calculators/LoadoutCalc/LoadoutCalc'
import { LaserTable } from '../tables/LaserTable'
import { ModuleTable } from '../tables/ModuleTable'
import { LaserIcon } from '../../icons/Laser'
import { ModuleIcon } from '../../icons/Module'
import { MiningLoadout, UserProfile } from '@regolithco/common'
import log from 'loglevel'
import { MyLoadouts } from './MyLoadouts'
import { Stack } from '@mui/system'

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
  const finalTab = typeof tab === 'undefined' ? LoadoutTabIndex.Calculator : tab
  const [modalOpen, setModalOpen] = React.useState(false)
  const isSmall = useMediaQuery(theme.breakpoints.down('md'))

  let fullScreenName = ''
  switch (finalTab) {
    case LoadoutTabIndex.Calculator:
      fullScreenName = 'Calculator'
      break
    case LoadoutTabIndex.MyLoadouts:
      fullScreenName = 'My Loadouts'
      break
    case LoadoutTabIndex.Lasers:
      fullScreenName = 'Lasers'
      break
    case LoadoutTabIndex.Modules:
      fullScreenName = 'Modules'
      break
  }

  const pageContent = React.useMemo(() => {
    return (
      <>
        <Tabs
          value={finalTab}
          variant="scrollable"
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
            loading={isLoggedIn && !userProfile}
            loadoutCount={loadouts.length}
            userProfile={userProfile}
            onCreate={(loadout) => {
              log.debug('Create loadout', loadout)
              createLoadout && createLoadout(loadout)
            }}
          />
        )}
        {finalTab === LoadoutTabIndex.MyLoadouts && !isLoggedIn && (
          <Alert
            severity="info"
            sx={{
              mx: 3,
              my: 5,
            }}
          >
            You must be logged in to save loadouts.
          </Alert>
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
              // consle.log('Add to loadout', laser)
            }}
          />
        )}
        {finalTab === LoadoutTabIndex.Modules && (
          <ModuleTable
            onAddToLoadout={(module) => {
              // TODO: Implement this
              log.error('NOT IMPLEMENTED: Add to loadout', module)
            }}
          />
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
          with this data. The current data is synched daily from UEX. If you see incorrect values let us know or you can
          sign up to be a{' '}
          <Link href="https://uexcorp.space/data/home" target="_blank">
            UEX Data Runner
          </Link>{' '}
          and submit a report to get theme altered.
        </Typography>
      </>
    )
  }, [
    theme,
    finalTab,
    isSmall,
    navigate,
    tab,
    isLoggedIn,
    userProfile,
    loadouts,
    loading,
    activeLoadout,
    createLoadout,
    updateLoadout,
    deleteLoadout,
  ])

  return (
    <PageWrapper
      title={
        <Stack direction="row" spacing={1} alignItems="center" justifyContent={'space-between'}>
          <Typography variant="h4">Mining Loadouts</Typography>
          {!isSmall && (
            <Tooltip title="Fullscreen View">
              <span>
                <IconButton
                  onClick={() => setModalOpen(true)}
                  sx={{}}
                  color="primary"
                  // disabled={tab === SurveyTabsEnum.LEADERBOARD || tab === SurveyTabsEnum.ABOUT_SURVEY_CORPS}
                >
                  <Fullscreen
                    sx={{
                      fontSize: theme.typography.h4.fontSize,
                    }}
                  />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </Stack>
      }
      maxWidth="xl"
    >
      {/* Fitler box */}
      {modalOpen ? (
        // Fullscreen modal
        <Modal
          open
          onClose={() => setModalOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: isSmall ? 'visible' : 'hidden',
              backgroundColor: '#262728',
            }}
          >
            <Box
              sx={{
                zIndex: 1000,
                position: 'absolute',
                top: 20,
                right: 20,
              }}
            >
              <IconButton onClick={() => setModalOpen(false)} color="error" size="large">
                <Close />
              </IconButton>
            </Box>

            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent={'center'}
              sx={{
                width: '100%',
              }}
            >
              <Typography
                variant={isSmall ? 'h6' : 'h4'}
                sx={{
                  fontFamily: theme.typography.fontFamily,
                  fontWeight: 'bold',
                  color: theme.palette.primary.main,
                }}
              >
                Regolith Mining Loadouts: {fullScreenName}
              </Typography>
            </Stack>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                paddingX: theme.spacing(2),
              }}
            >
              {pageContent}
            </Box>
          </Box>
        </Modal>
      ) : (
        pageContent
      )}
    </PageWrapper>
  )
}
