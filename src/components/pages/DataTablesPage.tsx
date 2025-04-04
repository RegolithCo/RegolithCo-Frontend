import * as React from 'react'
import { Typography, Tab, Tabs, useTheme, Theme, Alert, useMediaQuery } from '@mui/material'
import { Box, SxProps } from '@mui/system'
import { PageWrapper } from '../PageWrapper'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ShipOreTable } from '../tables/ShipOreTable'

import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { RefineryBonusTable } from '../calculators/RefineryCalc/RefineryBonusTable'
import { RefineryCalc } from '../calculators/RefineryCalc'
import { ObjectValues } from '@regolithco/common'
import { VehicleOreTable } from '../tables/VehicleOreTable'
import { SalvagingOreTable } from '../tables/SalvagingOreTable'

export const DataTablesPageContainer: React.FC = () => {
  const navigate = useNavigate()
  const { tab } = useParams()

  return <DataTablesPage navigate={navigate} tab={tab as DataTabsEnum} />
}

export interface DataTablesPageProps {
  tab: string
  navigate?: (path: string) => void
}

export const DataTabsEnum = {
  ORE: 'ore',
  REFINERY: 'refinery',
  MARKET: 'market',
} as const
export type DataTabsEnum = ObjectValues<typeof DataTabsEnum>

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  bigTabs: {
    display: 'block',
    fontSize: '1.2rem',
    '&.Mui-selected': {
      borderBottom: '2px solid',
    },
  },
  smallTabs: {
    display: 'block',
  },
})

export const DataTablesPage: React.FC<DataTablesPageProps> = ({ navigate, tab }) => {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const styles = stylesThunk(theme)

  const finalTab = typeof tab === 'undefined' ? DataTabsEnum.ORE : tab
  return (
    <PageWrapper title="Data Tables" maxWidth="lg">
      <Typography paragraph>
        Use these calculators to figure out where you should take your hard-won ore. You can also use Regolith's{' '}
        <Link to="/market-price" style={{ color: theme.palette.primary.main, textDecoration: 'underline' }}>
          Market Price Calculator
        </Link>{' '}
        to figure out how much you'll get from a given load of ore.
      </Typography>

      {!isSmall ? (
        <Tabs
          value={finalTab}
          sx={{
            mb: 2,
            width: '100%',
            // overflow: 'hidden',
            '& .MuiTab-root': {},
          }}
          onChange={(event: React.SyntheticEvent, newValue: DataTabsEnum) => {
            navigate && navigate(`/tables/${newValue}`)
          }}
          aria-label="basic tabs example"
        >
          <Tab label="Ore Calculator" value={DataTabsEnum.ORE} sx={styles.bigTabs} />
          <Tab label="Refinery Bonuses" value={DataTabsEnum.REFINERY} sx={styles.bigTabs} />
          <Tab label="Market Prices" value={DataTabsEnum.MARKET} sx={styles.bigTabs} />
        </Tabs>
      ) : (
        <Tabs
          value={finalTab}
          sx={{
            mb: 2,
            width: '100%',
            // overflow: 'hidden',
            '& .MuiTab-root': {},
          }}
          onChange={(event: React.SyntheticEvent, newValue: DataTabsEnum) => {
            navigate && navigate(`/tables/${newValue}`)
          }}
          aria-label="basic tabs example"
        >
          <Tab label="Ore Calc." value={DataTabsEnum.ORE} sx={styles.smallTabs} />
          <Tab label="Refineries" value={DataTabsEnum.REFINERY} sx={styles.smallTabs} />
          <Tab label="Market" value={DataTabsEnum.MARKET} sx={styles.smallTabs} />
        </Tabs>
      )}

      <Alert severity="info">
        All prices are the maximums of all systems reported by{' '}
        <Link
          to="https://uexcorp.space/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: theme.palette.primary.main, textDecoration: 'underline' }}
        >
          UEX
        </Link>
        .
      </Alert>

      {tab === DataTabsEnum.ORE && (
        <Box>
          <RefineryCalc />
        </Box>
      )}
      {tab === DataTabsEnum.REFINERY && (
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
          <RefineryBonusTable />
        </Box>
      )}
      {tab === DataTabsEnum.MARKET && (
        <Grid container spacing={4} margin={{ xs: 0, sm: 1, md: 2 }}>
          <Grid xs={12}>
            <Typography variant="h4" sx={{ borderBottom: '1px solid', mb: 4 }}>
              Ship Mining
            </Typography>
            <ShipOreTable />
          </Grid>
          <Grid xs={12}>
            <Typography variant="h4" sx={{ borderBottom: '1px solid', mb: 4 }}>
              Salvaging
            </Typography>
            <SalvagingOreTable />
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
