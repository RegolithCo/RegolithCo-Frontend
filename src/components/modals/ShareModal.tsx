import * as React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material'
import { Share, QuestionMark, SvgIconComponent } from '@mui/icons-material'
import { fontFamilies } from '../../theme'
import { Stack } from '@mui/system'
import { SessionContext } from '../../context/session.context'
import {
  ActivityEnum,
  defaultSessionName,
  makeHumanIds,
  ObjectValues,
  ScoutingFind,
  ScoutingFindTypeEnum,
  Session,
  WorkOrder,
} from '@regolithco/common'
import { ImageDownloadComponent } from '../sharing/ImageDownloadComponent'
import { WorkOrderShare } from '../sharing/WorkOrderShare'
import { SessionShare } from '../sharing/SessionShare'
import { ClawIcon, GemIcon, RockIcon } from '../../icons'
import { ClusterShare } from '../sharing/ClusterShare'

export interface ShareModalProps {
  open: boolean
  onClose: () => void
}

export const ShareTypeEnum = {
  SESSION: 'Session',
  WORK_ORDER: 'Work Order',
  CLUSTER: 'Cluster',
} as const
export type DataTabsEnum = ObjectValues<typeof ShareTypeEnum>

export const ShareModal: React.FC<ShareModalProps> = ({ open, onClose }) => {
  const theme = useTheme()
  const { session } = React.useContext(SessionContext)
  const [activeTab, setActiveTab] = React.useState<DataTabsEnum>(ShareTypeEnum.SESSION)
  const [obfuscate, setObfuscate] = React.useState<boolean>(false)
  const [activeWorkOrderId, setActiveWorkOrderId] = React.useState<string | null>(() => {
    if (!session?.workOrders?.items?.length) return null
    const firstWorkOrder = session?.workOrders?.items[0]
    return firstWorkOrder?.orderId
  })
  const activeWorkOrder: WorkOrder | null =
    session?.workOrders?.items.find((wo) => wo.orderId === activeWorkOrderId) || null

  const [activeScoutingFindId, setActiveScoutingFindId] = React.useState<string | null>(() => {
    if (!session?.scouting?.items?.length) return null
    const firstFind = session?.scouting?.items[0]
    return firstFind?.scoutingFindId
  })
  const activeScoutingFind: ScoutingFind | null =
    session?.scouting?.items.find((find) => find.scoutingFindId === activeScoutingFindId) || null

  const urlFriendlySessionName = (session?.name || defaultSessionName()).replace(/ /g, '_') || 'Session'

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 10,
          boxShadow: `0px 0px 20px 5px ${theme.palette.primary.light}, 0px 0px 60px 40px black`,
          background: theme.palette.background.default,
          border: `10px solid ${theme.palette.primary.main}`,
          // px: 4,
          // py: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          position: 'relative',
          fontFamily: fontFamilies.robotoMono,
          fontWeight: 'bold',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          textAlign: 'center',
          mb: 2,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="center">
          <Share
            sx={{
              fontSize: 30,
              mr: 2,
              // position: 'absolute',
              // left: 20,
              // top: 15,
            }}
          />
          <Typography variant="h4">Share</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        {/* Tabs to choose: Session, work order or scouting */}
        <Tabs
          value={activeTab}
          onChange={(e, activity) => {
            setActiveTab(activity)
          }}
          sx={{
            mb: 3,
          }}
        >
          <Tab label="Session" value={ShareTypeEnum.SESSION} />
          <Tab label="Work Order" value={ShareTypeEnum.WORK_ORDER} />
          <Tab label="Scouting Find" value={ShareTypeEnum.CLUSTER} />
        </Tabs>

        {activeTab === ShareTypeEnum.SESSION && (
          <Stack spacing={2} alignItems="left" justifyContent="center">
            <ImageDownloadComponent
              fileName={`Regolith-Session-${urlFriendlySessionName}`}
              leftContent={
                <Typography variant="body1">
                  You can download a snapshot of this session and share it on social media or in discord.
                </Typography>
              }
            >
              <SessionShare session={session as Session} />
            </ImageDownloadComponent>
          </Stack>
        )}
        {activeTab === ShareTypeEnum.WORK_ORDER && (
          <Stack spacing={2} alignItems="center" justifyContent="center">
            <Select
              placeholder="Select a work order"
              value={activeWorkOrderId || ''}
              onChange={(e) => {
                setActiveWorkOrderId(e.target.value as string)
              }}
            >
              {session?.workOrders?.items.map((workOrder, idx) => {
                let title = ''
                let WorkIcon: SvgIconComponent
                if (!workOrder) return null
                switch (workOrder.orderType) {
                  case ActivityEnum.Salvage:
                    title = 'Salvage Work Order'
                    WorkIcon = ClawIcon
                    break
                  case ActivityEnum.ShipMining:
                    title = 'Ship Mining Work Order'
                    WorkIcon = RockIcon
                    break
                  case ActivityEnum.VehicleMining:
                    title = 'Vehicle Mining Work Order'
                    WorkIcon = GemIcon
                    break
                  case ActivityEnum.Other:
                    title = 'Arbitrary aUEC Work Order'
                    WorkIcon = QuestionMark
                    break
                  default:
                    return <>DisplayError</>
                }
                return (
                  <MenuItem key={`${workOrder.orderId}-${idx}`} value={workOrder.orderId}>
                    <Stack direction="row" alignItems="space" justifyContent="space-between">
                      <WorkIcon color="inherit" fontSize="large" sx={{ mr: 2 }} />
                      <Typography variant="h6">
                        ({makeHumanIds(workOrder.sellerscName || workOrder.owner?.scName, workOrder.orderId)}) {title}
                      </Typography>
                    </Stack>
                  </MenuItem>
                )
              })}
            </Select>
            {!activeWorkOrder && <Typography>Select a work order to share</Typography>}
            {activeWorkOrder && (
              <ImageDownloadComponent
                fileName={`Regolith-${activeWorkOrder.orderType}-${activeWorkOrder.orderId}`}
                leftContent={
                  <Typography variant="body1">
                    You can download a snapshot of this session and share it on social media or in discord.
                  </Typography>
                }
              >
                <WorkOrderShare workOrder={activeWorkOrder} />
              </ImageDownloadComponent>
            )}
          </Stack>
        )}

        {activeTab === ShareTypeEnum.CLUSTER && (
          <Stack spacing={2} alignItems="center" justifyContent="center">
            <Select
              value={activeScoutingFindId || ''}
              onChange={(e) => {
                setActiveScoutingFindId(e.target.value as string)
              }}
            >
              {session?.scouting?.items.map((scoutingFind, idx) => {
                let title = ''
                let WorkIcon: SvgIconComponent
                if (!scoutingFind) return null
                switch (scoutingFind.clusterType) {
                  case ScoutingFindTypeEnum.Salvage:
                    title = 'Salvage Cluster'
                    WorkIcon = ClawIcon
                    break
                  case ScoutingFindTypeEnum.Vehicle:
                    title = 'ROC Gem Cluster'
                    WorkIcon = RockIcon
                    break
                  case ScoutingFindTypeEnum.Ship:
                    title = 'Ship Cluster'
                    WorkIcon = GemIcon
                    break
                  default:
                    return <>DisplayError</>
                }
                return (
                  <MenuItem key={`${scoutingFind.scoutingFindId}-${idx}`} value={scoutingFind.scoutingFindId}>
                    <Stack direction="row" alignItems="space" justifyContent="space-between">
                      <WorkIcon color="inherit" fontSize="large" sx={{ mr: 2 }} />
                      <Typography variant="h6">
                        ({makeHumanIds(scoutingFind.scoutingFindId)}) {title}
                      </Typography>
                    </Stack>
                  </MenuItem>
                )
              })}
            </Select>
            {!activeScoutingFind && <Typography>Select a scouting find to share</Typography>}
            {activeScoutingFind && (
              <ImageDownloadComponent
                fileName={`Regolith-${activeScoutingFind.clusterType}-${activeScoutingFind.scoutingFindId}`}
                leftContent={
                  <Typography variant="body1">
                    You can download a snapshot of this scouting find and share it on social media or in discord.
                  </Typography>
                }
              >
                <ClusterShare scoutingFind={activeScoutingFind} />
              </ImageDownloadComponent>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <div style={{ flexGrow: 1 }} />
        <Button color="primary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
