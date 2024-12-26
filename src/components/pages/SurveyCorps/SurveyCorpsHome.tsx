import * as React from 'react'

import { PageWrapper } from '../../PageWrapper'
import { Avatar, Box, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material'
import { ShipOreDistribution } from './ShipOreDistribution'
import { GemIcon, RockIcon, SurveyCorpsIcon } from '../../../icons'

export interface SurveyCorpsHomeProps {
  loading?: boolean
  activeTab?: number
  setActiveTab?: (tab: number) => void
}

export const SurveyCorpsHome: React.FC<SurveyCorpsHomeProps> = ({ loading, activeTab, setActiveTab }) => {
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
          <Typography variant="h4">Survey Corps</Typography>
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
          value={activeTab}
          onChange={(_, newValue) => {
            // setActiveTab(newValue)
          }}
        >
          <Tab label="Ship Ores" value={1} icon={<RockIcon />} />
          <Tab label="Vehicle / Hand Ores" value={1} icon={<GemIcon />} />
          <Tab label="About Survey Corps." value={2} icon={<SurveyCorpsIcon />} />
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
        <ShipOreDistribution />
      </Box>
    </PageWrapper>
  )
}
