import * as React from 'react'

import { ScoutingFindStateEnum, SessionStateEnum } from '@regolithco/common'
import {
  Box,
  FormControlLabel,
  FormGroup,
  IconButton,
  Switch,
  SxProps,
  Theme,
  Stack,
  Typography,
  useTheme,
  Zoom,
  Popper,
  useMediaQuery,
  Tooltip,
  Grid,
} from '@mui/material'
import { ScoutingAddFAB } from '../../fields/ScoutingAddFAB'
import { WorkOrderAddFAB } from '../../fields/WorkOrderAddFAB'
import { ExpandMore, Podcasts } from '@mui/icons-material'
import { WorkOrderTable } from './WorkOrderTable'
import { ClusterCard } from '../../cards/ClusterCard'
import { fontFamilies } from '../../../theme'
import { SessionContext } from '../../../context/session.context'
import { grey } from '@mui/material/colors'
import { WorkOrderTableColsEnum } from './WorkOrderTableRow'
import { ScanModal } from '../../modals/ScanModal'

export interface TabDashboardProps {
  propA?: string
}

const stylesThunk = (theme: Theme, isActive: boolean): Record<string, SxProps<Theme>> => ({
  container: {
    // border: '3px solid red',
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  sectionTitle: {
    flex: '0 0',
    userSelect: 'none',
    cursor: 'pointer',
    borderTop: `1px solid ${isActive ? theme.palette.primary.dark : grey[400]}`,
    borderBottom: `1px solid ${isActive ? theme.palette.primary.dark : grey[400]}`,
    // disable selection
    '& .MuiTypography-root': {
      fontFamily: fontFamilies.robotoMono,
      fontWeight: 'bold',
      color: theme.palette.primary.contrastText,
    },
    background: '#121115aa',
    backgroundColor: isActive ? theme.palette.primary.main : grey[600],
    color: theme.palette.primary.contrastText,
  },
  collapse: {
    // border: '3px solid purple',
    position: 'relative',
    overflow: 'hidden',
    // Animate the height and the flex
    // transition: 'height 2s ease-in-out, flex-grow 2s ease-in-out, flex-shrink 2s ease-in-out',
    transition: 'flex-grow 0.3s ease-in-out',
  },
  sectionContent: {
    // border: '3px solid purple',
    background: theme.palette.background.default,
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  cardGridContainer: {
    // border: '10px solid green',
    pt: 1,
    pb: 8,
    px: 2,
    maxHeight: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  switchText: {
    '& .MuiTypography-root': {
      fontSize: '0.7rem',
      fontStyle: 'italic',
    },
  },
})

export const TabDashboard: React.FC<TabDashboardProps> = () => {
  const theme = useTheme()
  const { session, createNewWorkOrder, createNewScoutingFind, openWorkOrderModal } = React.useContext(SessionContext)
  const mediumUp = useMediaQuery(theme.breakpoints.up('md'))
  const [scanModalOpen, setScanModalOpen] = React.useState(false)
  const [[topExpanded, bottomExpanded], setExpanded] = React.useState([true, mediumUp])

  // Handlers for the SpeedDials
  const workOrderAccordionRef = React.useRef<HTMLElement>(null)
  const scoutingAccordionRef = React.useRef<HTMLElement>(null)
  const [workOrderFABAnchorEl, setWorkOrderAnchorEl] = React.useState<HTMLElement | null>(null)
  const [scoutingFindFABAnchorEl, setScoutingFindAnchorEl] = React.useState<HTMLElement | null>(null)

  React.useEffect(() => {
    if (workOrderAccordionRef.current) setWorkOrderAnchorEl(workOrderAccordionRef.current)
  }, [workOrderAccordionRef.current])
  React.useEffect(() => {
    if (scoutingAccordionRef.current) setScoutingFindAnchorEl(scoutingAccordionRef.current)
  }, [scoutingAccordionRef.current])

  const isActive = session?.state === SessionStateEnum.Active
  const styles = stylesThunk(theme, isActive)
  // Filtering for the accordions
  const [filterClosedScout, setFilterClosedScout] = React.useState(false)
  const [filterPaidWorkOrders, setFilterPaidWorkOrders] = React.useState(false)
  const badStates: ScoutingFindStateEnum[] = [ScoutingFindStateEnum.Abandonned, ScoutingFindStateEnum.Depleted]

  const allScouts = session?.scouting?.items || []
  const filteredScouts = allScouts.filter(({ state }) => !filterClosedScout || badStates.indexOf(state) < 0)
  filteredScouts.sort((a, b) => b.createdAt - a.createdAt)

  const allWorkOrders = session?.workOrders?.items || []
  const filteredWorkOrders = filterPaidWorkOrders
    ? allWorkOrders.filter(({ crewShares }) => crewShares?.some(({ state }) => !state))
    : [...allWorkOrders]

  const scountingCounts = [filteredScouts.length, allScouts.length]
  const workOrderCounts = [filteredWorkOrders.length, allWorkOrders.length]

  // The cards shoould only ever take 2s to appear
  const cardDelay = 1000 / filteredScouts.length

  return (
    <Box sx={styles.container}>
      <Stack
        direction="row"
        alignItems="center"
        sx={styles.sectionTitle}
        onClick={() => {
          // IF this is mediumUp the accordions work independently. Otherwise they are linked
          if (mediumUp) setExpanded(([oldTop, OldBottom]) => [!oldTop, OldBottom])
          else setExpanded(([oldTop]) => [!oldTop, oldTop])
        }}
      >
        <IconButton color="inherit">
          <ExpandMore
            sx={{
              // Animat this so it's upside down when expanded
              transform: topExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
              transition: 'transform 0.3s ease-in-out',
            }}
          />
        </IconButton>
        <Typography>
          Work Orders ({workOrderCounts[0]}/{workOrderCounts[1]})
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <FormGroup
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <FormControlLabel
            sx={{ mr: 1, ...styles.switchText }}
            labelPlacement="start"
            color="secondary"
            control={
              <Switch
                color="secondary"
                checked={filterPaidWorkOrders}
                onChange={(e) => setFilterPaidWorkOrders(e.target.checked)}
              />
            }
            label="Hide paid"
          />
        </FormGroup>
      </Stack>
      <Box
        ref={workOrderAccordionRef}
        sx={{ ...styles.collapse, flex: topExpanded ? `1 1 ${bottomExpanded ? '48%' : '90%'}` : '0 0 0' }}
      >
        <Box sx={styles.sectionContent}>
          <WorkOrderTable
            workOrders={filteredWorkOrders || []}
            sessionActive={isActive}
            onRowClick={(sessionId, orderId) => openWorkOrderModal(orderId)}
            columns={[
              WorkOrderTableColsEnum.Activity,
              WorkOrderTableColsEnum.Refinery,
              WorkOrderTableColsEnum.OrderId,
              // WorkOrderTableColsEnum.Shares,
              WorkOrderTableColsEnum.Ores,
              WorkOrderTableColsEnum.Volume,
              WorkOrderTableColsEnum.Gross,
              WorkOrderTableColsEnum.Net,
              WorkOrderTableColsEnum.FinishedTime,
              WorkOrderTableColsEnum.Sold,
              WorkOrderTableColsEnum.Paid,
            ]}
          />
        </Box>
        {topExpanded && workOrderFABAnchorEl && (
          <Popper open anchorEl={workOrderFABAnchorEl} placement="bottom-end">
            <WorkOrderAddFAB
              onClick={createNewWorkOrder}
              sessionSettings={session?.sessionSettings}
              fabProps={{
                disabled: !isActive,
              }}
            />
          </Popper>
        )}
      </Box>

      <Stack
        direction="row"
        alignItems="center"
        sx={styles.sectionTitle}
        onClick={() => {
          if (mediumUp) setExpanded(([oldTop, OldBottom]) => [oldTop, !OldBottom])
          else setExpanded(([, OldBottom]) => [OldBottom, !OldBottom])
        }}
      >
        <IconButton color="inherit">
          <ExpandMore
            sx={{
              // Animat this so it's upside down when expanded
              transform: bottomExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
              transition: 'transform 0.3s ease-in-out',
            }}
          />
        </IconButton>
        <Typography>
          Scouting Finds ({scountingCounts[0]}/{scountingCounts[1]})
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Tooltip title="Signal Calculator">
          <IconButton
            color="inherit"
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              setScanModalOpen(true)
            }}
          >
            <Podcasts />
          </IconButton>
        </Tooltip>
        <FormGroup
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <FormControlLabel
            sx={{ mr: 1, ...styles.switchText }}
            labelPlacement="start"
            control={
              <Switch
                color="secondary"
                checked={filterClosedScout}
                onChange={(e) => setFilterClosedScout(e.target.checked)}
              />
            }
            label="Hide Innactive"
          />
        </FormGroup>
      </Stack>
      <Box
        ref={scoutingAccordionRef}
        sx={{ ...styles.collapse, flex: bottomExpanded ? `1 1 ${topExpanded ? '48%' : '90%'}` : '0 0 0' }}
      >
        <Box sx={styles.sectionContent}>
          <Grid container spacing={2} margin={0} sx={styles.cardGridContainer}>
            {filteredScouts.map((scouting, idx) => {
              return (
                <Grid key={`scoutingfind-${idx}`}>
                  <Zoom in style={{ transitionDelay: `${cardDelay * idx}ms` }}>
                    <Box>
                      <ClusterCard key={idx} scoutingFind={scouting} />
                    </Box>
                  </Zoom>
                </Grid>
              )
            })}
          </Grid>
        </Box>
        {bottomExpanded && scoutingFindFABAnchorEl && (
          <Popper open anchorEl={scoutingFindFABAnchorEl} placement="bottom-end">
            <ScoutingAddFAB
              onClick={createNewScoutingFind}
              sessionSettings={session?.sessionSettings}
              fabProps={{
                disabled: !isActive,
              }}
            />
          </Popper>
        )}
        {scanModalOpen && <ScanModal open={scanModalOpen} onClose={() => setScanModalOpen(false)} />}
      </Box>
    </Box>
  )
}
