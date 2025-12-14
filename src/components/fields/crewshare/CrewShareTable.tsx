import React, { useMemo, useState } from 'react'
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useTheme,
  Box,
  Stack,
  MenuItem,
  Button,
  Menu,
} from '@mui/material'
import {
  CrewShare,
  SessionRoleEnum,
  ShareTypeEnum,
  ShipRoleEnum,
  UserSuggest,
  validateSCName,
  WorkOrder,
  WorkOrderDefaults,
  WorkOrderSummary,
} from '@regolithco/common'
import { CrewShareTableRow } from './CrewShareTableRow'
import { UserPicker } from '../UserPicker'
import { fontFamilies } from '../../../theme'
import { ArrowDropDown, Cancel, ChevronLeft, GroupAdd } from '@mui/icons-material'
import { SessionContext } from '../../../context/session.context'
import { ShipRoleCounts, shipRoleOptions } from '../ShipRoleChooser'
import { SessionRoleCounts, sessionRoleOptions } from '../SessionRoleChooser'
import { RoleCrewShareAddModal } from '../../modals/RoleCrewShareAddModal'
import { DeleteModal } from '../../modals/DeleteModal'
// import log from 'loglevel'

export interface CrewShareTableProps {
  workOrder: WorkOrder
  onChange: (workOrder: WorkOrder) => void
  scrollRef?: React.RefObject<HTMLDivElement>
  markCrewSharePaid?: (crewShare: CrewShare, paid: boolean) => void
  onDeleteCrewShare?: (scName: string) => void
  allowPay?: boolean
  allowEdit?: boolean
  isEditing?: boolean
  isShare?: boolean // is this an exportable share?
  isCalculator?: boolean
  templateJob?: WorkOrderDefaults
  userSuggest?: UserSuggest
  summary: WorkOrderSummary
}

export const CrewShareTable: React.FC<CrewShareTableProps> = ({
  workOrder,
  allowPay,
  summary,
  allowEdit,
  isEditing,
  scrollRef,
  isShare,
  isCalculator,
  onChange,
  markCrewSharePaid,
  onDeleteCrewShare,
  templateJob,
  userSuggest,
}) => {
  const theme = useTheme()
  // const styles = stylesThunk(theme)
  const [keyCounter, setKeyCounter] = React.useState(0)
  const [addByRoleOpen, setAddByRoleOpen] = useState<ShipRoleEnum | SessionRoleEnum | null>(null)
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false)

  const { captains, crewHierarchy, session } = React.useContext(SessionContext)

  const [addMenuOpen, setAddMenuOpen] = useState<HTMLElement | null>(null)
  const [addMenuOpen2, setAddMenuOpen2] = useState<(HTMLElement | null)[]>([null, null, null])

  const sortedCrewshares: [number, CrewShare][] = (workOrder.crewShares || []).map((cs, idx) => [idx, cs])
  const typeOrder = [ShareTypeEnum.Amount, ShareTypeEnum.Percent, ShareTypeEnum.Share]
  sortedCrewshares.sort(([, csa], [, csb]) => {
    // Owner to the top
    if (csa.payeeScName === workOrder.owner?.scName) {
      return 1
    }
    // Sort by index of the type order
    if (csa.shareType !== csb.shareType) {
      return typeOrder.indexOf(csa.shareType) - typeOrder.indexOf(csb.shareType)
    }
    // sort by scName
    return csa.payeeScName.localeCompare(csb.payeeScName)
  })

  const numSharesTotal = sortedCrewshares.reduce(
    (acc, [, cs]) => (cs.shareType === ShareTypeEnum.Share ? acc + (cs?.share as number) : acc),
    0
  )

  const { shipRoleCounts, sessionRoleCounts } = useMemo(() => {
    if (!userSuggest) return { shipRoleCounts: {} as ShipRoleCounts, sessionRoleCounts: {} as SessionRoleCounts }
    const shipRoleCounts = Object.values(ShipRoleEnum).reduce((acc, shipRole) => {
      return {
        ...acc,
        [shipRole]: Object.values(userSuggest).filter((usr) => usr.shipRole && usr.shipRole === shipRole).length,
      }
    }, {} as ShipRoleCounts)

    const sessionRoleCounts = Object.values(SessionRoleEnum).reduce((acc, sessionRole) => {
      return {
        ...acc,
        [sessionRole]: Object.values(userSuggest).filter((usr) => usr.sessionRole && usr.sessionRole === sessionRole)
          .length,
      }
    }, {} as SessionRoleCounts)

    return { shipRoleCounts, sessionRoleCounts }
  }, [userSuggest])

  const sessionRows = (templateJob?.crewShares || []).map(({ payeeScName }) => payeeScName)
  const mandatoryRows = templateJob?.lockedFields && templateJob?.lockedFields.includes('crewShares') ? sessionRows : []

  return (
    <Box>
      {isEditing && (
        <Stack direction={'row'} spacing={1} sx={{ mb: 1 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ flexGrow: 1, maxWidth: '300px' }}>
            <UserPicker
              label=""
              toolTip="Add a user to the work order"
              onChange={(addName) => {
                if (
                  validateSCName(addName) &&
                  !(workOrder.crewShares || []).find((cs) => cs.payeeScName.toLowerCase() === addName.toLowerCase())
                ) {
                  setKeyCounter(keyCounter + 1)
                  onChange({
                    ...workOrder,
                    crewShares: [
                      ...(workOrder.crewShares || []),
                      {
                        payeeScName: addName,
                        shareType: ShareTypeEnum.Share,
                        share: 1,
                        note: null,
                        createdAt: Date.now(),
                        orderId: workOrder.orderId,
                        sessionId: workOrder.sessionId,
                        updatedAt: Date.now(),
                        state: false,
                        __typename: 'CrewShare',
                      },
                    ],
                  })
                  // Now scroll to the bottom of scrollRef after 200 ms
                  setTimeout(() => {
                    scrollRef?.current?.scrollTo({
                      top: scrollRef?.current?.scrollHeight,
                      behavior: 'smooth',
                    })
                  }, 200)
                }
              }}
              userSuggest={userSuggest}
              includeFriends
              includeMentioned
              disableList={workOrder.crewShares?.map((cs) => cs.payeeScName) || []}
            />
          </Box>
          {isEditing && (
            <>
              {!isCalculator && userSuggest && (
                <Button
                  size="small"
                  color="primary"
                  startIcon={<GroupAdd />}
                  endIcon={<ArrowDropDown />}
                  onClick={(e) => setAddMenuOpen(e.currentTarget)}
                >
                  Group Add
                </Button>
              )}
              {addMenuOpen && userSuggest && (
                <Menu
                  anchorEl={addMenuOpen}
                  open
                  onClose={() => setAddMenuOpen(null)}
                  slotProps={{
                    paper: {
                      style: {
                        // backgroundColor: theme.palette.primary.main,
                        // color: theme.palette.primary.contrastText,
                      },
                    },
                  }}
                >
                  <MenuItem
                    sx={{ pl: 3 }}
                    onClick={() => {
                      const newShares: string[] = Object.entries(userSuggest)
                        .reduce((acc, [scName, entry]) => {
                          if (entry.named || entry.session) {
                            acc.push(scName)
                          }
                          return acc
                        }, [] as string[])
                        .filter((scName) => {
                          return !workOrder.crewShares?.find((cs) => cs.payeeScName === scName)
                        })

                      // Make sure we have something to add
                      if (newShares.length === 0) return
                      onChange({
                        ...workOrder,
                        crewShares: [
                          ...(workOrder.crewShares || []),
                          ...newShares.map((payeeScName) => {
                            return {
                              payeeScName,
                              payeeUserId: userSuggest[payeeScName].userId,
                              shareType: ShareTypeEnum.Share,
                              share: 1,
                              note: null,
                              createdAt: Date.now(),
                              orderId: workOrder.orderId,
                              sessionId: workOrder.sessionId,
                              updatedAt: Date.now(),
                              state: false,
                              __typename: 'CrewShare',
                            } as CrewShare
                          }),
                        ],
                      })
                      setAddMenuOpen(null)
                    }}
                  >
                    All Session Users
                  </MenuItem>
                  <MenuItem
                    selected={!!addMenuOpen2[0]}
                    sx={{ pl: 0 }}
                    disabled={captains.length === 0}
                    onClick={(e) => {
                      setAddMenuOpen2([e.currentTarget, null, null])
                    }}
                  >
                    <ChevronLeft sx={{ opacity: addMenuOpen2[0] ? 1 : 0.1 }} />
                    By Crew
                  </MenuItem>
                  {addMenuOpen2[0] && (
                    <Menu
                      anchorEl={addMenuOpen2[0]}
                      open
                      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                      onClose={() => setAddMenuOpen2([null, null, null])}
                    >
                      {captains.map((captain) => {
                        const captainId = captain.ownerId
                        const captainScNAme = captain.owner?.scName as string
                        return (
                          <MenuItem
                            key={captainId}
                            sx={{
                              '&:hover': {
                                backgroundColor: theme.palette.primary.dark,
                                color: theme.palette.primary.contrastText,
                              },
                            }}
                            onClick={() => {
                              const { activeIds, innactiveSCNames } = crewHierarchy[captainId]
                              const userIdMap = activeIds.reduce((acc, activeId) => {
                                const crewMemeber = session?.activeMembers?.items.find((m) => m.ownerId === activeId)
                                if (!crewMemeber) return acc
                                return {
                                  ...acc,
                                  [crewMemeber?.ownerId as string]: crewMemeber?.owner?.scName,
                                }
                              }, {})
                              const crewNames: string[] = [
                                captainScNAme,
                                ...innactiveSCNames,
                                ...activeIds.map(
                                  (id) =>
                                    session?.activeMembers?.items.find((m) => m.ownerId === id)?.owner?.scName as string
                                ),
                              ]
                                .filter((scName) => scName)
                                .filter((scName) => {
                                  return !workOrder.crewShares?.find((cs) => cs.payeeScName === scName)
                                })

                              // Make sure we have something to add
                              if (crewNames.length === 0) return
                              onChange({
                                ...workOrder,
                                crewShares: [
                                  ...(workOrder.crewShares || []),
                                  ...crewNames.map(
                                    (payeeScName) =>
                                      ({
                                        payeeScName,
                                        payeeUserId: userIdMap[payeeScName],
                                        shareType: ShareTypeEnum.Share,
                                        share: 1,
                                        note: null,
                                        createdAt: Date.now(),
                                        orderId: workOrder.orderId,
                                        sessionId: workOrder.sessionId,
                                        updatedAt: Date.now(),
                                        state: false,
                                        __typename: 'CrewShare',
                                      }) as CrewShare
                                  ),
                                ],
                              })

                              // Make sure to close the menu
                              setAddMenuOpen(null)
                              setAddMenuOpen2([null, null, null])
                            }}
                          >
                            Add <strong style={{ marginLeft: '10px' }}>{captainScNAme}</strong>'s crew
                          </MenuItem>
                        )
                      })}
                    </Menu>
                  )}
                  <MenuItem
                    selected={!!addMenuOpen2[1]}
                    sx={{ pl: 0 }}
                    onClick={(e) => {
                      setAddMenuOpen2([null, e.currentTarget, null])
                    }}
                  >
                    <ChevronLeft sx={{ opacity: addMenuOpen2[1] ? 1 : 0.1 }} />
                    By Session Role
                  </MenuItem>
                  {addMenuOpen2[1] && (
                    <Menu
                      anchorEl={addMenuOpen2[1]}
                      open
                      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                      onClose={() => setAddMenuOpen2([null, null, null])}
                    >
                      {sessionRoleOptions(sessionRoleCounts, true, (role) => {
                        setAddByRoleOpen(role as SessionRoleEnum)
                        setAddMenuOpen(null)
                        setAddMenuOpen2([null, null, null])
                      })}
                    </Menu>
                  )}
                  <MenuItem
                    selected={!!addMenuOpen2[2]}
                    sx={{ pl: 0 }}
                    onClick={(e) => {
                      setAddMenuOpen2([null, null, e.currentTarget])
                    }}
                  >
                    <ChevronLeft sx={{ opacity: addMenuOpen2[2] ? 1 : 0.1 }} />
                    By Ship Role
                  </MenuItem>
                  {addMenuOpen2[2] && (
                    <Menu
                      anchorEl={addMenuOpen2[2]}
                      open
                      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                      onClose={() => setAddMenuOpen2([null, null, null])}
                    >
                      {shipRoleOptions(shipRoleCounts, true, (role) => {
                        setAddByRoleOpen(role as ShipRoleEnum)
                        setAddMenuOpen(null)
                        setAddMenuOpen2([null, null, null])
                      })}
                    </Menu>
                  )}
                </Menu>
              )}

              <Button
                size="small"
                color="error"
                // down arrow on the end
                startIcon={<Cancel />}
                onClick={() => {
                  setClearConfirmOpen(true)
                }}
              >
                Clear All
              </Button>
            </>
          )}
        </Stack>
      )}

      <Box
        sx={{
          border: `1px solid ${isEditing ? theme.palette.secondary.main : '#000'}`,
          borderRadius: 3,
          py: 1,
          px: 0.5,
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{
                '& .MuiTableCell-root': {
                  color: theme.palette.text.secondary,
                  fontFamily: fontFamilies.robotoMono,
                  fontSize: theme.typography.caption.fontSize,
                  fontWeight: 'bold',
                },
              }}
            >
              <TableCell align="left" colSpan={3}>
                Username
              </TableCell>
              <TableCell align="left" colSpan={2} padding="none">
                Share
              </TableCell>
              <TableCell align="right" sx={{ color: theme.palette.primary.light }} padding="none">
                aUEC
              </TableCell>
              {/* The delete button only shows if we are editing */}
              {!isShare && (
                <TableCell align="left" colSpan={isEditing ? 3 : 2} padding="checkbox">
                  {!isEditing ? 'Paid' : 'Note'}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCrewshares.map(([idx, crewShare]) => (
              <CrewShareTableRow
                key={`crewShare-${idx}`}
                crewShare={crewShare}
                expenses={workOrder.expenses || []}
                isMe={crewShare.payeeScName === workOrder.owner?.scName}
                isShare={isShare}
                userSuggest={userSuggest}
                isSeller={
                  workOrder.sellerscName
                    ? crewShare.payeeScName === workOrder.sellerscName
                    : crewShare.payeeScName === workOrder.owner?.scName
                }
                allowPay={allowPay}
                numSharesTotal={numSharesTotal}
                isMandatory={mandatoryRows.includes(crewShare.payeeScName)}
                isSessionRow={sessionRows.includes(crewShare.payeeScName)}
                includeTransferFee={Boolean(workOrder.includeTransferFee)}
                onDelete={() => {
                  onDeleteCrewShare && onDeleteCrewShare(crewShare.payeeScName)
                }}
                onChange={(newCrewShare) => {
                  onChange({
                    ...workOrder,
                    crewShares: workOrder.crewShares?.map((cs, i) => (i === idx ? newCrewShare : cs)),
                  })
                }}
                markCrewSharePaid={markCrewSharePaid}
                payoutSummary={(summary.crewShareSummary || [])[idx]}
                isEditing={isEditing}
                allowEdit={allowEdit}
                remainder={summary.remainder || 0n}
              />
            ))}
          </TableBody>
        </Table>
      </Box>
      {clearConfirmOpen && (
        <DeleteModal
          open={clearConfirmOpen}
          title="Clear All Crew Shares"
          message="Are you sure you want to clear all crew shares? This will wipe out any crew shares (except the seller) as well as any expenses that belong to them."
          onClose={() => setClearConfirmOpen(false)}
          confirmBtnText="Clear All"
          onConfirm={() => {
            const ownerSCName = workOrder.sellerscName ? workOrder.sellerscName : workOrder.owner?.scName
            onChange({
              ...workOrder,
              crewShares: workOrder.crewShares?.filter((cs) => cs.payeeScName === ownerSCName) || [],
              expenses: workOrder.expenses?.filter((ex) => {
                return ex.ownerScName === ownerSCName
              }),
            })

            setClearConfirmOpen(false)
          }}
        />
      )}

      {addByRoleOpen && (
        <RoleCrewShareAddModal
          open={!!addByRoleOpen}
          userSuggest={userSuggest}
          role={addByRoleOpen}
          onClose={() => setAddByRoleOpen(null)}
          onConfirm={({ scNames, share, shareType }) => {
            if (!userSuggest) return
            const newShares = (workOrder.crewShares || []).filter((cs) => !scNames.includes(cs.payeeScName))
            // Now we have to build and merge new crewshares for these users
            onChange({
              ...workOrder,
              crewShares: [
                ...newShares,
                ...scNames.map((payeeScName) => {
                  return {
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    orderId: workOrder.orderId,
                    sessionId: workOrder.sessionId,
                    payeeScName,
                    payeeUserId: userSuggest[payeeScName].userId,
                    note: `Added by role: ${addByRoleOpen}`,
                    state: false,
                    // These two are set
                    shareType,
                    share,
                    __typename: 'CrewShare',
                  } as CrewShare
                }),
              ],
            })
          }}
        />
      )}
    </Box>
  )
}
