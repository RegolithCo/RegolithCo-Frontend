import * as React from 'react'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material'
import { Share, QuestionMark, SvgIconComponent, Diversity3 } from '@mui/icons-material'
import { fontFamilies } from '../../theme'
import { Box, Stack } from '@mui/system'
import { SessionContext } from '../../context/session.context'
import dayjs from 'dayjs'
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
  initScoutingFindId: string | null
  initWorkOrderId: string | null
  onClose: () => void
}

export const ShareTypeEnum = {
  SESSION: 'Session',
  WORK_ORDER: 'Work Order',
  CLUSTER: 'Scouting Find',
} as const
export type DataTabsEnum = ObjectValues<typeof ShareTypeEnum>

export const ShareModal: React.FC<ShareModalProps> = ({ open, onClose, initScoutingFindId, initWorkOrderId }) => {
  const theme = useTheme()
  const { session } = React.useContext(SessionContext)
  const [activeTab, setActiveTab] = React.useState<DataTabsEnum>(() => {
    if (initScoutingFindId) return ShareTypeEnum.CLUSTER
    if (initWorkOrderId) return ShareTypeEnum.WORK_ORDER
    return ShareTypeEnum.SESSION
  })
  const [obfuscate, setObfuscate] = React.useState<boolean>(false)

  const sortedWorkOrders = React.useMemo(() => {
    if (!session?.workOrders?.items?.length) return []
    return [...(session?.workOrders?.items || [])].sort((a, b) => {
      if (!a || !b) return 0
      return b.createdAt - a.createdAt
    })
  }, [session?.workOrders?.items])

  const [activeWorkOrderId, setActiveWorkOrderId] = React.useState<string | null>(() => {
    if (initWorkOrderId) return initWorkOrderId
    if (!sortedWorkOrders.length) return null
    const firstWorkOrder = sortedWorkOrders[0]
    return firstWorkOrder?.orderId
  })
  const activeWorkOrder: WorkOrder | null =
    session?.workOrders?.items.find((wo) => wo.orderId === activeWorkOrderId) || null

  const sortedScoutingFinds = React.useMemo(() => {
    if (!session?.scouting?.items?.length) return []
    return [...(session?.scouting?.items || [])].sort((a, b) => {
      if (!a || !b) return 0
      return b.createdAt - a.createdAt
    })
  }, [session?.scouting?.items])

  const [activeScoutingFindId, setActiveScoutingFindId] = React.useState<string | null>(() => {
    if (initScoutingFindId) return initScoutingFindId
    if (!sortedScoutingFinds.length) return null
    const firstFind = sortedScoutingFinds[0]
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
          <Typography variant="h4">Share {activeTab}</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        {/* Tabs to choose: Session, work order or scouting */}
        <ToggleButtonGroup
          value={activeTab}
          color="primary"
          exclusive
          onChange={(e, activity) => {
            if (!activity) return
            setActiveTab(activity)
          }}
        >
          <ToggleButton value={ShareTypeEnum.SESSION} aria-label="left aligned">
            Entire Session
          </ToggleButton>
          <ToggleButton value={ShareTypeEnum.WORK_ORDER} aria-label="centered" disabled={sortedWorkOrders.length === 0}>
            Single Work Order
          </ToggleButton>
          <ToggleButton
            value={ShareTypeEnum.CLUSTER}
            aria-label="right aligned"
            disabled={sortedScoutingFinds.length === 0}
          >
            Single Scouting Find
          </ToggleButton>
        </ToggleButtonGroup>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body1" paragraph>
            You can download an image snapshot of all or part of this session to share on social media, Discord etc. If
            you want to collaborate and invite people to your session use the invite icon (<Diversity3 />) instead.
          </Typography>
        </Alert>

        {activeTab === ShareTypeEnum.SESSION && (
          <Stack spacing={2} alignItems="left" justifyContent="center">
            <ImageDownloadComponent fileName={`Regolith-Session-${urlFriendlySessionName}`} widthPx={800}>
              <SessionShare session={session as Session} />
            </ImageDownloadComponent>
          </Stack>
        )}
        {activeTab === ShareTypeEnum.WORK_ORDER && (
          <Stack spacing={2} alignItems="center" justifyContent="center">
            {!activeWorkOrder && <Typography>Select a work order to share</Typography>}
            {activeWorkOrder && (
              <ImageDownloadComponent
                fileName={`Regolith-${activeWorkOrder.orderType}-${makeHumanIds(
                  activeWorkOrder.owner?.scName,
                  activeWorkOrder.orderId
                )}`}
                widthPx={1000}
                leftContent={
                  <Box sx={{ flex: 1, pt: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Select a Work Order</InputLabel>
                      <Select
                        label={'Select a Work Order'}
                        placeholder="Select a Work Order"
                        value={activeWorkOrderId || ''}
                        onChange={(e) => {
                          setActiveWorkOrderId(e.target.value as string)
                        }}
                      >
                        {sortedWorkOrders.map((workOrder, idx) => {
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
                              <Stack
                                direction="row"
                                alignItems="space"
                                padding={0}
                                justifyContent="space-between"
                                sx={{
                                  width: '100%',
                                }}
                              >
                                <WorkIcon color="inherit" fontSize="large" sx={{ mr: 2, flex: '1 1 5%' }} />
                                <Typography
                                  variant="overline"
                                  color={'info'}
                                  flex={'1 1 10%'}
                                  sx={{ color: theme.palette.info.main }}
                                >
                                  {dayjs(workOrder.createdAt).format('h:mm a')}
                                </Typography>
                                <Typography variant="subtitle1" flex={'1 1 20%'}>
                                  {title}
                                </Typography>
                                <Typography variant="subtitle1" flex={'1 1 30%'}>
                                  ({makeHumanIds(workOrder.sellerscName || workOrder.owner?.scName, workOrder.orderId)})
                                </Typography>
                              </Stack>
                            </MenuItem>
                          )
                        })}
                      </Select>
                    </FormControl>
                  </Box>
                }
              >
                <WorkOrderShare workOrder={activeWorkOrder} />
              </ImageDownloadComponent>
            )}
          </Stack>
        )}

        {activeTab === ShareTypeEnum.CLUSTER && (
          <Stack spacing={2} alignItems="center" justifyContent="center">
            {!activeScoutingFind && (
              <Typography variant={'overline'} color="text.secondary">
                No scouting finds to share
              </Typography>
            )}
            {activeScoutingFind && (
              <ImageDownloadComponent
                fileName={`Regolith-${activeScoutingFind.clusterType}-${
                  makeHumanIds(activeScoutingFind.scoutingFindId).split('-')[0]
                }`}
                widthPx={800}
                leftContent={
                  <Box sx={{ flex: 1, pt: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Select a Scouting Find</InputLabel>
                      <Select
                        fullWidth
                        color="secondary"
                        label={'Select a Scouting Find'}
                        value={activeScoutingFindId || ''}
                        onChange={(e) => {
                          setActiveScoutingFindId(e.target.value as string)
                        }}
                      >
                        {sortedScoutingFinds.map((scoutingFind, idx) => {
                          let title = ''
                          let ScoutIcon: SvgIconComponent
                          if (!scoutingFind) return null
                          switch (scoutingFind.clusterType) {
                            case ScoutingFindTypeEnum.Salvage:
                              title = 'Salvage Cluster'
                              ScoutIcon = ClawIcon
                              break
                            case ScoutingFindTypeEnum.Vehicle:
                              title = 'ROC Gem Cluster'
                              ScoutIcon = GemIcon
                              break
                            case ScoutingFindTypeEnum.Ship:
                              title = 'Ship Cluster'
                              ScoutIcon = RockIcon
                              break
                            default:
                              return <>DisplayError</>
                          }
                          return (
                            <MenuItem
                              key={`${scoutingFind.scoutingFindId}-${idx}`}
                              value={scoutingFind.scoutingFindId}
                              sx={{
                                width: '100%',
                              }}
                            >
                              <Stack
                                direction="row"
                                alignItems="space"
                                justifyContent="space-between"
                                sx={{
                                  width: '100%',
                                }}
                              >
                                <ScoutIcon color="inherit" fontSize="large" sx={{ mr: 2, flex: '0 0 10%' }} />
                                <Typography variant="overline" flex={'0 1 10%'} sx={{ color: theme.palette.info.main }}>
                                  {dayjs(scoutingFind.createdAt).format('h:mm a')}
                                </Typography>
                                <Typography variant="subtitle1" flex={'1 1 30%'}>
                                  {title} ({makeHumanIds(scoutingFind.scoutingFindId).split('-')[0]})
                                </Typography>
                                <Typography variant="subtitle1" flex={'0 1 20%'} textAlign="left">
                                  {scoutingFind.clusterCount} Rock{(scoutingFind?.clusterCount || 0) > 1 && 's'}
                                </Typography>
                                <Typography variant="subtitle1" flex={'0 1 20%'} color="text.secondary">
                                  {scoutingFind.state}
                                </Typography>
                              </Stack>
                            </MenuItem>
                          )
                        })}
                      </Select>
                    </FormControl>
                  </Box>
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
