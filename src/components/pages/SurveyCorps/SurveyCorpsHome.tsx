import * as React from 'react'

import { PageWrapper } from '../../PageWrapper'
import { Box, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material'
import { ShipOreDistribution } from './ShipOreDistribution'
import { GemIcon, RockIcon, SurveyCorpsIcon } from '../../../icons'
import { ObjectValues } from '@regolithco/common'
import { useNavigate, useParams } from 'react-router-dom'
import { SurveyCorpsAbout } from './SurveyCorpsAbout'

export const SurveyTabsEnum = {
  SHIP_ORE: 'rocks',
  VEHICLE_ORE: 'gems',
  ABOUT_SURVEY_CORPS: 'about',
} as const
export type SurveyTabsEnum = ObjectValues<typeof SurveyTabsEnum>

export const SurveyCorpsHomeContainer: React.FC = () => {
  const navigate = useNavigate()
  const { tab } = useParams()

  return <SurveyCorpsHome navigate={navigate} tab={tab as SurveyTabsEnum} />
}

export interface SurveyCorpsHomeProps {
  loading?: boolean
  tab?: SurveyTabsEnum
  navigate?: (path: string) => void
  setActiveTab?: (tab: number) => void
}

export const SurveyCorpsHome: React.FC<SurveyCorpsHomeProps> = ({ loading, tab, setActiveTab, navigate }) => {
  const theme = useTheme()

  return (
    <PageWrapper
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
            Survey Corps
          </Typography>
        </Stack>
      }
      loading={loading}
      maxWidth={'lg'}
      sx={
        {
          //
        }
      }
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider', flex: '0 0' }}>
        <Tabs
          value={tab}
          onChange={(_, newValue) => {
            navigate && navigate(`/survey/${newValue}`)
            // setActiveTab(newValue)
          }}
        >
          <Tab label="Ship Ores" value={SurveyTabsEnum.SHIP_ORE} icon={<RockIcon />} />
          <Tab label="Vehicle / Hand Ores" value={SurveyTabsEnum.VEHICLE_ORE} icon={<GemIcon />} />
          <Tab label="About Survey Corps" value={SurveyTabsEnum.ABOUT_SURVEY_CORPS} icon={<SurveyCorpsIcon />} />
        </Tabs>
      </Box>
      <Box
        sx={
          {
            //
          }
        }
      >
        {/* Fitler box */}
        {tab === SurveyTabsEnum.SHIP_ORE && <ShipOreDistribution />}
        {tab === SurveyTabsEnum.VEHICLE_ORE && <ShipOreDistribution />}
        {tab === SurveyTabsEnum.ABOUT_SURVEY_CORPS && <SurveyCorpsAbout />}
      </Box>
    </PageWrapper>
  )
}
