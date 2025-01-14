import * as React from 'react'
import { Alert, Box, Link, Stack, ThemeProvider, Typography, useTheme } from '@mui/material'
import { PageWrapper } from '../PageWrapper'

import { UserProfile, ScoutingFindTypeEnum, ScoutingFind, SessionUser, ScoutingFindStateEnum } from '@regolithco/common'
import { dummySession, dummySessionUser, dummyUserProfile, newEmptyScoutingFind } from '../../lib/newObjectFactories'
import { ScoutingFindCalc } from '../calculators/ScoutingFindCalc'
import { useLogin } from '../../hooks/useOAuth2'
import { ScoutingFindTypeChooser } from '../fields/ScoutingFindTypeChooser'
import { scoutingFindStateThemes } from '../../theme'

export interface ClusterCalcPageProps {
  userProfile?: UserProfile
}

export const ClusterCalcPage: React.FC<ClusterCalcPageProps> = ({ userProfile }) => {
  const [clusters, setClusters] = React.useState<{ [key in ScoutingFindTypeEnum]?: ScoutingFind }>({})
  const [activeScoutingFindType, setActiveScoutingFindType] = React.useState<ScoutingFindTypeEnum>(
    ScoutingFindTypeEnum.Ship
  )
  const theme = useTheme()
  const owner = userProfile || dummyUserProfile()
  const session = dummySession(owner)
  const sessionUser: SessionUser = dummySessionUser(owner)

  const activeScoutingFind = React.useMemo(() => {
    if (clusters && clusters[activeScoutingFindType]) return clusters && clusters[activeScoutingFindType]
    else {
      const newFind = newEmptyScoutingFind(session, sessionUser, activeScoutingFindType, false)
      newFind.state = ScoutingFindStateEnum.Discovered
      return newFind
    }
  }, [clusters, activeScoutingFindType])

  return (
    <PageWrapper title="Cluster Calculator" maxWidth="md" sx={{}}>
      <Typography variant="h4" component="h1" gutterBottom></Typography>
      <Typography variant="body1" paragraph>
        This is a standalone calculator for determining the value of a rock cluster. Simply click "Add Scan" to get
        started.
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          [theme.breakpoints.up('md')]: {
            m: { md: 2, sm: 0, xs: 0 },
          },
        }}
      >
        <Box
          sx={{
            [theme.breakpoints.up('md')]: {
              mx: 3,
              flex: '1 1 50%',
            },
          }}
        >
          <ScoutingFindTypeChooser onChange={setActiveScoutingFindType} value={activeScoutingFindType} />
        </Box>
      </Stack>
      <Box
        sx={{
          display: 'flex',
          margin: '0 auto',
          overflow: 'hidden',
          borderRadius: 10,
          border: `8px solid rgb(181, 206, 255)`,
        }}
      >
        {activeScoutingFind && (
          <ThemeProvider theme={scoutingFindStateThemes.DISCOVERED}>
            <ScoutingFindCalc
              me={sessionUser}
              scoutingFind={activeScoutingFind}
              allowEdit
              standalone
              onChange={(newScoutingFind) => {
                setClusters({
                  ...(clusters ? clusters : {}),
                  [activeScoutingFindType]: { ...newScoutingFind },
                })
              }}
            />
          </ThemeProvider>
        )}
      </Box>
      <Alert severity="info" sx={{ m: 2, flex: '1 1 50%', [theme.breakpoints.down('sm')]: { display: 'none' } }}>
        NOTE: This is a standalone calculator. If you want to work on more than one cluster, store consecutive clusters
        or share your clusters with friends then consider logging in and creating/joining a <strong>session</strong>{' '}
        from the <Link href="/dashboard">dashboard</Link>. Scouted rocks inside Sessions can be captured automatically
        from the game or by uploading screenshots using OCR.
      </Alert>
    </PageWrapper>
  )
}

export const ClusterCalcPageContainer: React.FC = () => {
  const { userProfile } = useLogin()

  return <ClusterCalcPage userProfile={userProfile} />
}
