import React, { useMemo } from 'react'
import { SxProps, Theme, useTheme } from '@mui/material'

import {
  calculateWorkOrder,
  UserSuggest,
  ActivityEnum,
  WorkOrder,
  WorkOrderDefaults,
  CrewShare,
} from '@regolithco/common'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { ExpensesSharesCard } from './WorkOrderCards/ExpensesSharesCard'
import { DetailsCard } from './WorkOrderCards/DetailsCard'
import { OreCard } from './WorkOrderCards/OreCard'
import log from 'loglevel'

export interface WorkOrderCalcProps {
  workOrder: WorkOrder
  onChange: (workOrder: WorkOrder) => void
  markCrewSharePaid?: (crewShare: CrewShare, paid: boolean) => void
  onDeleteCrewShare?: (scName: string) => void
  failWorkOrder?: (reason?: string) => void
  allowEdit?: boolean
  allowPay?: boolean
  isNew?: boolean
  isEditing?: boolean
  templateJob?: WorkOrderDefaults
  userSuggest?: UserSuggest
  sx?: SxProps<Theme>
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  container: {
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
      minHeight: 600,
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
  const styles = stylesThunk(theme)
  const summary = useMemo(() => calculateWorkOrder(props.workOrder), [props.workOrder])
  const { workOrder } = props
  return (
    <>
      {workOrder.orderType !== ActivityEnum.Other && (
        <Grid
          container
          spacing={{ md: 1, lg: 2 }}
          marginX={{ xs: 0, sm: 0, md: 0, lg: 1 }}
          marginY={{ xs: 0, sm: 1, md: 2, lg: 3 }}
          sx={styles.container}
        >
          <Grid xs={12} sm={12} md={3} lg={3} sx={styles.gridCss}>
            <DetailsCard {...props} sx={styles.cardCss} />
          </Grid>
          <Grid xs={12} sm={12} md={4} lg={4} sx={styles.gridCss}>
            <OreCard summary={summary} {...props} sx={styles.cardCss} />
          </Grid>
          <Grid xs={12} sm={12} md={5} lg={5} sx={styles.gridCss}>
            <ExpensesSharesCard summary={summary} {...props} sx={styles.cardCss} />
          </Grid>
        </Grid>
      )}
      {workOrder.orderType === ActivityEnum.Other && (
        <Grid container spacing={{ md: 1, lg: 2 }} margin={0} sx={styles.container}>
          <Grid xs={12} sm={12} md={6} lg={4} sx={styles.gridCss}>
            <DetailsCard {...props} sx={styles.cardCss} />
          </Grid>
          <Grid xs={12} sm={12} md={6} lg={8} sx={styles.gridCss}>
            <ExpensesSharesCard summary={summary} {...props} sx={styles.cardCss} />
          </Grid>
        </Grid>
      )}
    </>
  )
}
