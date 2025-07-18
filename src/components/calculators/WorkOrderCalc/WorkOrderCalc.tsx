import React, { useEffect } from 'react'
import { SxProps, Theme, useTheme, Grid } from '@mui/material'

import {
  calculateWorkOrder,
  UserSuggest,
  ActivityEnum,
  WorkOrder,
  WorkOrderDefaults,
  CrewShare,
  WorkOrderSummary,
  SystemEnum,
} from '@regolithco/common'
import { ExpensesSharesCard } from './WorkOrderCards/ExpensesSharesCard'
// import { DetailsCard } from './WorkOrderCards/DetailsCard'
import { OreCard } from './WorkOrderCards/OreCard'
import { LookupsContext } from '../../../context/lookupsContext'

export interface WorkOrderCalcProps {
  workOrder: WorkOrder
  onChange: (workOrder: WorkOrder) => void
  markCrewSharePaid?: (crewShare: CrewShare, paid: boolean) => void
  onDeleteCrewShare?: (scName: string) => void
  failWorkOrder?: (reason?: string) => void
  allowEdit?: boolean
  allowPay?: boolean
  isNew?: boolean
  isShare?: boolean // is this an exportable share?
  isMine?: boolean
  isCalculator?: boolean
  systemFilter?: SystemEnum | null
  isEditing?: boolean
  templateJob?: WorkOrderDefaults
  userSuggest?: UserSuggest
  sx?: SxProps<Theme>
}

const workOrderStylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  container: {
    width: '100%',
    [theme.breakpoints.up('md')]: {
      flex: '1 1',
      overflowX: 'hidden',
      overflowY: 'hidden',
    },
  },
  cardCss: {
    border: `1px solid #444444`,
    [theme.breakpoints.up('md')]: {
      borderRadius: 2,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      // minHeight: 600,
      overflowX: 'hidden',
      overflowY: 'hidden',
    },
    [theme.breakpoints.down('sm')]: {
      borderRadius: 0,
      border: `None`,
    },
  },
  gridCss: {
    [theme.breakpoints.up('md')]: {
      height: '100%',
      overflowX: 'hidden',
      overflowY: 'hidden',
    },
  },
})

export const WorkOrderCalc: React.FC<WorkOrderCalcProps> = (props) => {
  const theme = useTheme()
  const [summary, setSummary] = React.useState<WorkOrderSummary | null>(null)
  const styles = workOrderStylesThunk(theme)
  const dataStore = React.useContext(LookupsContext)

  useEffect(() => {
    if (!dataStore.ready) return
    const calcSummary = async () => {
      const summary = await calculateWorkOrder(dataStore, props.workOrder)
      setSummary(summary)
    }
    calcSummary()
  }, [props.workOrder, dataStore.ready])

  const { workOrder } = props

  if (!summary || !dataStore.ready) return <div>Loading...</div>
  return (
    <>
      {workOrder.orderType !== ActivityEnum.Other && (
        <Grid
          container
          columnSpacing={{ sm: 0, md: 2, lg: 3 }}
          marginX={{ xs: 0, sm: 0, md: 0, lg: 1 }}
          marginY={{ xs: 0, sm: 1, md: 2, lg: 3 }}
          sx={styles.container}
        >
          {/* <Grid xs={12} sm={12} md={3} lg={3} sx={styles.gridCss}>
            <DetailsCard {...props} sx={styles.cardCss} />
          </Grid> */}
          <Grid size={{ xs: 12, sm: 12, md: 5, lg: 5 }} sx={styles.gridCss}>
            <OreCard summary={summary} {...props} sx={styles.cardCss} />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 7, lg: 7 }} sx={styles.gridCss}>
            <ExpensesSharesCard summary={summary} {...props} sx={styles.cardCss} />
          </Grid>
        </Grid>
      )}
      {workOrder.orderType === ActivityEnum.Other && (
        <Grid container spacing={{ md: 2, lg: 3 }} margin={0} sx={styles.container}>
          <Grid size={{ xs: 12 }} sx={styles.gridCss}>
            <ExpensesSharesCard summary={summary} {...props} sx={styles.cardCss} />
          </Grid>
        </Grid>
      )}
    </>
  )
}
