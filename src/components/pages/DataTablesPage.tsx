import * as React from 'react'
import { Typography, Tab, Tabs, useTheme, Theme } from '@mui/material'
import { Box, SxProps } from '@mui/system'
import { PageWrapper } from '../PageWrapper'
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

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  bigTabs: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
      fontSize: '1.2rem',
    },
  },
  smallTabs: {
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  },
})

export const DataTablesPage: React.FC<DataTablesPageProps> = ({ navigate, tab }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)

  const finalTab = typeof tab === 'undefined' ? 'ore' : tab
  return (
    <PageWrapper title="Data Tables" maxWidth="md">
      <Typography paragraph>Use these calculators to figure out where you should take your hard-won ore. </Typography>
      <Tabs
        value={finalTab}
        sx={{
          mb: 2,
          width: '100%',
          overflow: 'hidden',
          '& .MuiTab-root': {},
        }}
        onChange={(event: React.SyntheticEvent, newValue: number) => {
          navigate && navigate(`/tables/${newValue}`)
        }}
        aria-label="basic tabs example"
      >
        <Tab label="Ore Calculator" value={'ore'} sx={styles.bigTabs} />
        <Tab label="Refinery Bonuses" value={'refinery'} sx={styles.bigTabs} />
        <Tab label="Market Prices" value={'market'} sx={styles.bigTabs} />

        <Tab label="Ore Calc." value={'ore'} sx={styles.smallTabs} />
        <Tab label="Refineries" value={'refinery'} sx={styles.smallTabs} />
        <Tab label="Market" value={'market'} sx={styles.smallTabs} />
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
        <Grid container spacing={4} margin={{ xs: 0, sm: 1, md: 2 }}>
          <Grid xs={12}>
            <Typography variant="h4" sx={{ borderBottom: '1px solid', mb: 4 }}>
              Ship Mining
            </Typography>
            <ShipOreTable />
          </Grid>
          <Grid xs={12}>
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
