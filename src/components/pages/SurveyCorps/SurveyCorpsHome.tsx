import * as React from 'react'

import {
  Box,
  Button,
  Container,
  IconButton,
  MenuItem,
  Modal,
  Select,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material'
import { ShipOreDistribution } from './ShipOreDistribution'
import { GemIcon, RockIcon, SurveyCorpsIcon } from '../../../icons'
import { getEpochFromVersion, ObjectValues, scVersion, ScVersionEpochEnum, SurveyData } from '@regolithco/common'
import { useNavigate, useParams } from 'react-router-dom'
import { SurveyCorpsAbout } from './SurveyCorpsAbout'
import { useGetPublicSurveyDataQuery } from '../../../schema'
import { Close, EmojiEvents, Fullscreen } from '@mui/icons-material'
import { SurveyCorpsLeaderBoard } from './SurveyCorpsLeaderBoard'
import { VehicleOreDistribution } from './VehicleOreDistribution'
import { TablePageWrapper } from '../../TablePageWrapper'
import { ShipOreClassDistribution } from './ShipOreClassDistribution'

export const SurveyTabsEnum = {
  SHIP_ORE: 'rocks',
  SHIP_ORE_CLASS: 'rock_class',
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
  return (
    <SurveyCorpsHome
      navigate={navigate}
      tab={tab as SurveyTabsEnum}
      surveyData={surveyData}
      epoch={epoch}
      setEpoch={setEpoch}
    />
  )
}

export interface SurveyCorpsHomeProps {
  loading?: boolean
  tab?: SurveyTabsEnum
  epoch: ScVersionEpochEnum
  setEpoch: (epoch: ScVersionEpochEnum) => void
  navigate?: (path: string) => void
  surveyData?: SurveyDataTables
}

export const SurveyCorpsHome: React.FC<SurveyCorpsHomeProps> = ({
  loading,
  tab,
  navigate,
  surveyData,
  epoch,
  setEpoch,
}) => {
  const theme = useTheme()
  const [modalOpen, setModalOpen] = React.useState(false)

  const pageContent = React.useMemo(() => {
    let pContent: React.ReactNode = null
    switch (tab) {
      case SurveyTabsEnum.SHIP_ORE:
        pContent = <ShipOreDistribution bonuses={surveyData?.bonusMap} data={surveyData?.shipOreByGravProb} />
        break
      case SurveyTabsEnum.SHIP_ORE_CLASS:
        pContent = <ShipOreClassDistribution data={surveyData?.shipOreByRockClassProb} />
        break
      case SurveyTabsEnum.VEHICLE_ORE:
        pContent = <VehicleOreDistribution data={surveyData?.vehicleProbs} />
        break
      case SurveyTabsEnum.ABOUT_SURVEY_CORPS:
        pContent = <SurveyCorpsAbout />
        break
      case SurveyTabsEnum.LEADERBOARD:
        pContent = <SurveyCorpsLeaderBoard data={surveyData?.leaderBoard} epoch={epoch} />
        break
    }
    return pContent
  }, [surveyData, epoch, tab])

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
    >
      <Container maxWidth={'lg'} sx={{ borderBottom: 1, borderColor: 'divider', flex: '0 0' }}>
        <Stack
          direction={{
            xs: 'column',
            md: 'row',
          }}
          spacing={2}
          component={'div'}
        >
          <Tabs
            value={tab}
            sx={{
              flex: '1 1',
              width: '100%',
            }}
            variant="scrollable"
            scrollButtons="auto"
            onChange={(_, newValue) => {
              navigate && navigate(`/survey/${newValue}`)
              // setActiveTab(newValue)
            }}
          >
            <Tab label="About Survey Corps" value={SurveyTabsEnum.ABOUT_SURVEY_CORPS} icon={<SurveyCorpsIcon />} />
            <Tab label="Rock Location" value={SurveyTabsEnum.SHIP_ORE} icon={<RockIcon />} />
            <Tab label="Rock Type" value={SurveyTabsEnum.SHIP_ORE_CLASS} icon={<RockIcon />} />
            <Tab label="ROC / Hand" value={SurveyTabsEnum.VEHICLE_ORE} icon={<GemIcon />} />
            <Tab label="Leaderboard" value={SurveyTabsEnum.LEADERBOARD} icon={<EmojiEvents />} />
          </Tabs>
          <Button
            onClick={() => setModalOpen(true)}
            color="primary"
            startIcon={<Fullscreen />}
            disabled={tab === SurveyTabsEnum.LEADERBOARD || tab === SurveyTabsEnum.ABOUT_SURVEY_CORPS}
          >
            Fullscreen
          </Button>
          {/* Epoch selector */}
          <Select value={epoch} onChange={(e) => setEpoch(e.target.value as ScVersionEpochEnum)} disabled={true}>
            {Object.values(ScVersionEpochEnum).map((epoch) => (
              <MenuItem key={epoch} value={epoch}>
                Epoch: {epoch}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Container>
      <Box
        sx={{
          height: '100%',
          overflow: 'hidden',
        }}
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
                overflow: 'hidden',
                backgroundColor: '#262728',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                }}
              >
                <IconButton onClick={() => setModalOpen(false)} color="error">
                  <Close />
                </IconButton>
              </Box>
              {pageContent}
            </Box>
          </Modal>
        ) : (
          pageContent
        )}
      </Box>
    </TablePageWrapper>
  )
}
