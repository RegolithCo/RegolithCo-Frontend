import React from 'react'
import { Table, TableHead, TableRow, TableCell, TableBody, useTheme, Tooltip, Box } from '@mui/material'
import {
  CrewShare,
  ShareTypeEnum,
  UserSuggest,
  validateSCName,
  WorkOrder,
  WorkOrderDefaults,
  WorkOrderSummary,
} from '@regolithco/common'
import { CrewShareTableRow } from './CrewShareTableRow'
import { UserPicker } from '../UserPicker'
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
  templateJob?: WorkOrderDefaults
  userSuggest?: UserSuggest
  summary: WorkOrderSummary
}

// const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
//   gridContainer: {
//     [theme.breakpoints.up('md')]: {},
//     '& .MuiTableCell-root *': {
//       [theme.breakpoints.down('sm')]: {
//         border: '1px solid red',
//         fontSize: '0.2rem',
//       },
//     },
//   },
// })

export const CrewShareTable: React.FC<CrewShareTableProps> = ({
  workOrder,
  allowPay,
  summary,
  allowEdit,
  isEditing,
  scrollRef,
  isShare,
  onChange,
  markCrewSharePaid,
  onDeleteCrewShare,
  templateJob,
  userSuggest,
}) => {
  const theme = useTheme()
  // const styles = stylesThunk(theme)
  const [keyCounter, setKeyCounter] = React.useState(0)

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

  const sessionRows = (templateJob?.crewShares || []).map(({ payeeScName }) => payeeScName)
  const mandatoryRows = templateJob?.lockedFields && templateJob?.lockedFields.includes('crewShares') ? sessionRows : []

  return (
    <Box
      sx={{ border: `1px solid ${isEditing ? theme.palette.secondary.main : '#000'}`, borderRadius: 3, py: 1, px: 0.5 }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="left">Username</TableCell>
            <TableCell align="left" colSpan={2} padding="none">
              Share
            </TableCell>
            <Tooltip
              title="The payout is the amount of aUEC that the user will receive from the work order."
              placement="top"
            >
              <TableCell align="right" sx={{ color: theme.palette.primary.light }} padding="none">
                aUEC
              </TableCell>
            </Tooltip>
            {/* The delete button only shows if we are editing */}
            {!isShare && (
              <TableCell align="left" colSpan={isEditing ? 3 : 2}>
                Paid
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedCrewshares.map(([idx, crewShare]) => (
            <CrewShareTableRow
              key={`crewShare-${idx}`}
              crewShare={crewShare}
              isMe={crewShare.payeeScName === workOrder.owner?.scName}
              isShare={isShare}
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
              remainder={summary.remainder || 0}
            />
          ))}
        </TableBody>
      </Table>
      {isEditing && (
        <Box sx={{ px: 0.5 }}>
          <UserPicker
            label="Add Crew Share Row"
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
      )}
    </Box>
  )
}
