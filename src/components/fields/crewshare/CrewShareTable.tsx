import React from 'react'
import { Table, TableHead, TableRow, TableCell, TableBody, useTheme, Theme, SxProps, Tooltip, Box } from '@mui/material'
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
import { MValue, MValueFormat } from '../MValue'
import { UserPicker } from '../UserPicker'
import { PersonAdd } from '@mui/icons-material'
// import log from 'loglevel'

export interface CrewShareTableProps {
  workOrder: WorkOrder
  onChange: (workOrder: WorkOrder) => void
  markCrewSharePaid?: (crewShare: CrewShare, paid: boolean) => void
  onDeleteCrewShare?: (scName: string) => void
  allowPay?: boolean
  allowEdit?: boolean
  isEditing?: boolean
  templateJob?: WorkOrderDefaults
  userSuggest?: UserSuggest
  summary: WorkOrderSummary
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  gridContainer: {
    [theme.breakpoints.up('md')]: {},
    '& .MuiTableCell-root *': {
      [theme.breakpoints.down('sm')]: {
        border: '1px solid red',
        fontSize: '0.2rem',
      },
    },
  },
})

export const CrewShareTable: React.FC<CrewShareTableProps> = ({
  workOrder,
  allowPay,
  summary,
  allowEdit,
  isEditing,
  onChange,
  markCrewSharePaid,
  onDeleteCrewShare,
  templateJob,
  userSuggest,
}) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  const expenses: { name: string; value: number }[] = []
  const [keyCounter, setKeyCounter] = React.useState(0)
  if (workOrder.includeTransferFee) {
    expenses.push({
      name: 'moTRADER',
      value: (summary?.transferFees as number) > -1 ? -1 * ((summary.transferFees as number) || 0) : 0,
    })
  }

  const sortedCrewshares: [number, CrewShare][] = (workOrder.crewShares || []).map((cs, idx) => [idx, cs])
  const typeOrder = [ShareTypeEnum.Amount, ShareTypeEnum.Percent, ShareTypeEnum.Share]
  sortedCrewshares.sort(([, csa], [, csb]) => {
    // Owner to the top
    if (csa.scName === workOrder.owner?.scName) {
      return 1
    }
    // Sort by index of the type order
    if (csa.shareType !== csb.shareType) {
      return typeOrder.indexOf(csa.shareType) - typeOrder.indexOf(csb.shareType)
    }
    // sort by scName
    return csa.scName.localeCompare(csb.scName)
  })

  const numSharesTotal = sortedCrewshares.reduce(
    (acc, [, cs]) => (cs.shareType === ShareTypeEnum.Share ? acc + (cs?.share as number) : acc),
    0
  )

  const sessionRows = (templateJob?.crewShares || []).map(({ scName }) => scName)
  const mandatoryRows = templateJob?.lockedFields && templateJob?.lockedFields.includes('crewShares') ? sessionRows : []

  return (
    <Box
      sx={{ border: `1px solid ${isEditing ? theme.palette.secondary.main : '#000'}`, borderRadius: 3, py: 1, px: 0.5 }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="left" padding="none">
              Username
            </TableCell>
            <TableCell align="center" padding="none">
              Type
            </TableCell>
            <TableCell align="right" padding="none" sx={{ color: theme.palette.text.secondary }}>
              Share
            </TableCell>
            <Tooltip title="The payout is the amount of aUEC that the user will receive from the work order.">
              <TableCell align="right" padding="none" sx={{ color: theme.palette.primary.light }}>
                Payout
              </TableCell>
            </Tooltip>
            <TableCell align="center" padding="none">
              Paid
            </TableCell>
            <TableCell align="center" padding="none">
              Note
            </TableCell>
            {/* The delete button only shows if we are editing */}
            {isEditing && <TableCell align="right"></TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedCrewshares.map(([idx, crewShare]) => (
            <CrewShareTableRow
              key={`crewShare-${idx}`}
              crewShare={crewShare}
              isMe={crewShare.scName === workOrder.owner?.scName}
              isSeller={
                workOrder.sellerscName
                  ? crewShare.scName === workOrder.sellerscName
                  : crewShare.scName === workOrder.owner?.scName
              }
              allowPay={allowPay}
              numSharesTotal={numSharesTotal}
              isMandatory={mandatoryRows.includes(crewShare.scName)}
              isSessionRow={sessionRows.includes(crewShare.scName)}
              includeTransferFee={Boolean(workOrder.includeTransferFee)}
              onDelete={() => {
                onDeleteCrewShare && onDeleteCrewShare(crewShare.scName)
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
          {expenses.map(({ name, value }, idx) => (
            <TableRow key={`expensesRows-${idx}`}>
              <TableCell component="th" scope="row" colSpan={2}>
                {name}
              </TableCell>
              <TableCell align="right" colSpan={3}>
                <MValue value={value} format={MValueFormat.currency} />
              </TableCell>
              <TableCell align="right">&nbsp;</TableCell>
            </TableRow>
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
                !(workOrder.crewShares || []).find((cs) => cs.scName.toLowerCase() === addName.toLowerCase()) !==
                  undefined
              ) {
                setKeyCounter(keyCounter + 1)
                onChange({
                  ...workOrder,
                  crewShares: [
                    ...(workOrder.crewShares || []),
                    {
                      scName: addName,
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
              }
            }}
            userSuggest={userSuggest}
            includeFriends
            includeMentioned
            disableList={workOrder.crewShares?.map((cs) => cs.scName) || []}
          />
        </Box>
      )}
    </Box>
  )
}
