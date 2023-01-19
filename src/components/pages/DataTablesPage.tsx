import * as React from 'react'
import { Typography, Tab, Tabs } from '@mui/material'
import { Box } from '@mui/system'
import { PageWrapper } from '../PageWrapper'
import { fontFamilies } from '../../theme'
import { useNavigate, useParams } from 'react-router-dom'
import { ShipOreTable } from '../calculators/ShipOreTable'
import { VehicleOreTable } from '../calculators/VehicleOreTable'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { RefineryBonusTable } from '../calculators/RefineryCalc/RefineryBonusTable'
import { RefineryCalc } from '../calculators/RefineryCalc'

export const DataTablesPageContainer: React.FC = () => {
  const navigate = useNavigate()
  const { tab } = useParams()

  return <DataTablesPage navigate={navigate} tab={tab as string} />
}

export interface DataTablesPageProps {
  tab: string
  navigate?: (path: string) => void
}

export const DataTablesPage: React.FC<DataTablesPageProps> = ({ navigate, tab }) => {
  const finalTab = typeof tab === 'undefined' ? 'ore' : tab
  return (
    <PageWrapper title="Data Tables" maxWidth="xl">
      <Typography paragraph>Use these calculators to figure out where you should take your hard-won ore. </Typography>
      <Tabs
        value={finalTab}
        sx={{
          mb: 2,
          '& .MuiTab-root': {
            fontSize: '1.5rem',
            textTransform: 'none',
            fontFamily: fontFamilies.robotoMono,
          },
        }}
        onChange={(event: React.SyntheticEvent, newValue: number) => {
          navigate && navigate(`/tables/${newValue}`)
        }}
        aria-label="basic tabs example"
      >
        <Tab label="Ore Calculator" value={'ore'} />
        <Tab label="Refinery Bonuses" value={'refinery'} />
        <Tab label="Market Prices" value={'market'} />
      </Tabs>
      {tab === 'ore' && (
        <Box>
          <RefineryCalc />
        </Box>
      )}
      {tab === 'refinery' && (
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
          <RefineryBonusTable />
        </Box>
      )}
      {tab === 'market' && (
        <Grid container spacing={4} margin={2}>
          <Grid xs={12} md={7}>
            <Typography variant="h4" sx={{ borderBottom: '1px solid', mb: 4 }}>
              Ship Mining
            </Typography>
            <ShipOreTable />
          </Grid>
          <Grid xs={12} md={5}>
            <Typography variant="h4" sx={{ borderBottom: '1px solid', mb: 4 }}>
              ROC Mining
            </Typography>
            <VehicleOreTable />
          </Grid>
        </Grid>
      )}
    </PageWrapper>
  )
}
