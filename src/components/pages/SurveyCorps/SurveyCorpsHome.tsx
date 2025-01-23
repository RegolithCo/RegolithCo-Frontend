import * as React from 'react'

import { Box, Container, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material'
import { ShipOreDistribution } from './ShipOreDistribution'
import { GemIcon, RockIcon, SurveyCorpsIcon } from '../../../icons'
import { getEpochFromVersion, ObjectValues, scVersion, ScVersionEpochEnum, SurveyData } from '@regolithco/common'
import { useNavigate, useParams } from 'react-router-dom'
import { SurveyCorpsAbout } from './SurveyCorpsAbout'
import { useGetPublicSurveyDataLazyQuery, useGetPublicSurveyDataQuery } from '../../../schema'
import { EmojiEvents } from '@mui/icons-material'
import { SurveyCorpsLeaderBoard } from './SurveyCorpsLeaderBoard'
import { ShipOreLocationStats } from './ShipOreLocationStats'
import { VehicleOreDistribution } from './VehicleOreDistribution'
import { TablePageWrapper } from '../../TablePageWrapper'
import { ShipOreClassDistribution } from './ShipOreClassDistribution'

export const SurveyTabsEnum = {
  SHIP_ORE: 'rocks',
  SHIP_ORE_CLASS: 'rock_class',
  SHIP_ORE_STATS: 'rock_stats',
  VEHICLE_ORE: 'gems',
  ABOUT_SURVEY_CORPS: 'about',
  LEADERBOARD: 'leaderboard',
} as const
export type SurveyTabsEnum = ObjectValues<typeof SurveyTabsEnum>

export type SurveyDataTables = {
  vehicleProbs: SurveyData | null
  shipOreByGravProb: SurveyData | null
  shipOreByRockClassProb: SurveyData | null
  bonusMap: SurveyData | null
  leaderBoard: SurveyData | null
}

export const SurveyCorpsHomeContainer: React.FC = () => {
  const navigate = useNavigate()
  const { tab } = useParams()
  const [epoch, setEpoch] = React.useState(getEpochFromVersion(scVersion))

  const vehicleProbs = useGetPublicSurveyDataQuery({
    variables: {
      dataName: 'vehicleProbs',
      epoch,
    },
    fetchPolicy: 'cache-first',
  })
  const shipOreByGravProb = useGetPublicSurveyDataQuery({
    variables: {
      dataName: 'shipOreByGravProb',
      epoch,
    },
    fetchPolicy: 'cache-first',
  })
  const shipOreByRockClassProb = useGetPublicSurveyDataQuery({
    variables: {
      dataName: 'shipOreByRockClassProb',
      epoch,
    },
    fetchPolicy: 'cache-first',
  })
  const bonusMap = useGetPublicSurveyDataQuery({
    variables: {
      dataName: 'bonusMap',
      epoch,
    },
    fetchPolicy: 'cache-first',
  })
  const leaderBoard = useGetPublicSurveyDataQuery({
    variables: {
      dataName: 'leaderBoard',
      epoch,
    },
    fetchPolicy: 'cache-first',
  })

  const surveyData: SurveyDataTables = {
    vehicleProbs: vehicleProbs.data?.surveyData || null,
    shipOreByGravProb: shipOreByGravProb.data?.surveyData || null,
    shipOreByRockClassProb: shipOreByRockClassProb.data?.surveyData || null,
    bonusMap: bonusMap.data?.surveyData || null,
    leaderBoard: leaderBoard.data?.surveyData || null,
  }
  return <SurveyCorpsHome navigate={navigate} tab={tab as SurveyTabsEnum} surveyData={surveyData} />
}

export interface SurveyCorpsHomeProps {
  loading?: boolean
  tab?: SurveyTabsEnum
  navigate?: (path: string) => void
  surveyData?: SurveyDataTables
}

export const SurveyCorpsHome: React.FC<SurveyCorpsHomeProps> = ({ loading, tab, navigate, surveyData }) => {
  const theme = useTheme()

  return (
    <TablePageWrapper
      title={
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent={'center'}
          sx={{
            width: '100%',
          }}
        >
          <SurveyCorpsIcon
            sx={{
              width: 48,
              height: 48,
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontFamily: theme.typography.fontFamily,
              fontWeight: 'bold',
              color: theme.palette.primary.main,
            }}
          >
            Regolith Survey Corps
          </Typography>
        </Stack>
      }
      loading={loading}
      sx={
        {
          //
        }
      }
    >
      <Container maxWidth={'lg'} sx={{ borderBottom: 1, borderColor: 'divider', flex: '0 0' }}>
        <Tabs
          value={tab}
          onChange={(_, newValue) => {
            navigate && navigate(`/survey/${newValue}`)
            // setActiveTab(newValue)
          }}
        >
          <Tab label="Rock Location" value={SurveyTabsEnum.SHIP_ORE} icon={<RockIcon />} />
          <Tab label="Rock Type" value={SurveyTabsEnum.SHIP_ORE_CLASS} icon={<RockIcon />} />
          <Tab label="Rock Stats" value={SurveyTabsEnum.SHIP_ORE_STATS} icon={<RockIcon />} />
          <Tab label="ROC / Hand" value={SurveyTabsEnum.VEHICLE_ORE} icon={<GemIcon />} />
          <Tab label="Leaderboard" value={SurveyTabsEnum.LEADERBOARD} icon={<EmojiEvents />} />
          <Tab label="About Survey Corps" value={SurveyTabsEnum.ABOUT_SURVEY_CORPS} icon={<SurveyCorpsIcon />} />
        </Tabs>
      </Container>
      <Box
        sx={
          {
            //
          }
        }
      >
        {/* Fitler box */}
        {tab === SurveyTabsEnum.SHIP_ORE && <ShipOreDistribution data={surveyData?.shipOreByGravProb} />}
        {tab === SurveyTabsEnum.SHIP_ORE_CLASS && (
          <ShipOreClassDistribution data={surveyData?.shipOreByRockClassProb} />
        )}
        {tab === SurveyTabsEnum.SHIP_ORE_STATS && (
          <ShipOreLocationStats data={surveyData?.shipOreByGravProb} bonuses={surveyData?.bonusMap} />
        )}
        {tab === SurveyTabsEnum.VEHICLE_ORE && <VehicleOreDistribution data={surveyData?.vehicleProbs} />}
        {tab === SurveyTabsEnum.ABOUT_SURVEY_CORPS && <SurveyCorpsAbout />}
        {tab === SurveyTabsEnum.LEADERBOARD && <SurveyCorpsLeaderBoard data={surveyData?.leaderBoard} />}
      </Box>
    </TablePageWrapper>
  )
}
