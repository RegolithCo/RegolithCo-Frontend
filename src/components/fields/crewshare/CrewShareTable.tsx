import React from 'react'
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useTheme,
  Theme,
  SxProps,
  Autocomplete,
  TextField,
  createFilterOptions,
  Tooltip,
} from '@mui/material'
import {
  CrewShare,
  ShareTypeEnum,
  UserSuggest,
  validateSCName,
  WorkOrder,
  WorkOrderDefaults,
  WorkOrderSummary,
} from '@orgminer/common'
import { CrewShareTableRow } from './CrewShareTableRow'
import { MValue, MValueFormat } from '../MValue'
import { UserListItem } from '../UserListItem'
// import log from 'loglevel'

export interface CrewShareTableProps {
  workOrder: WorkOrder
  onChange: (workOrder: WorkOrder) => void
  onSetCrewSharePaid?: (scName: string, paid: boolean) => void
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
  },
})

const filter = createFilterOptions<
  [
    string,
    {
      friend: boolean
      session: boolean
      named: boolean
    }
  ]
>()

export const CrewShareTable: React.FC<CrewShareTableProps> = ({
  workOrder,
  allowPay,
  summary,
  allowEdit,
  isEditing,
  onChange,
  onSetCrewSharePaid,
  onDeleteCrewShare,
  templateJob,
  userSuggest,
}) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  const expenses: { name: string; value: number }[] = []
  if (workOrder.includeTransferFee) {
    expenses.push({
      name: 'moTRADER Service Fees',
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
    <>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="left" padding="none">
              Username
            </TableCell>
            <TableCell align="center" padding="none">
              Type
            </TableCell>
            <TableCell align="right" padding="none">
              Share
            </TableCell>
            <Tooltip title="The payout is the amount of aUEC that the user will receive from the work order.">
              <TableCell align="right" padding="none">
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
              onSetCrewSharePaid={onSetCrewSharePaid}
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
        <Autocomplete
          id="adduser"
          autoHighlight
          blurOnSelect
          renderOption={(props, [scName, { friend, session, named }]) => (
            <UserListItem
              scName={scName}
              key={`scname-${scName}`}
              props={props}
              session={session}
              named={named}
              friend={friend}
            />
          )}
          getOptionLabel={(option) => option[0]}
          getOptionDisabled={(option) =>
            (workOrder.crewShares || []).find((cs) => cs.scName === option[0]) !== undefined
          }
          options={Object.entries(userSuggest || {})}
          sx={{ my: 3 }}
          fullWidth
          freeSolo
          selectOnFocus
          renderInput={(params) => <TextField {...params} label="Add User" />}
          filterOptions={(options, params) => {
            const filtered = filter(options, params)
            if (params.inputValue !== '') {
              filtered.push([params.inputValue, { session: false, friend: false, named: false }])
            }
            return filtered
          }}
          onChange={(event, option) => {
            if (option && option[0] && validateSCName(option[0])) {
              onChange({
                ...workOrder,
                crewShares: [
                  ...(workOrder.crewShares || []),
                  {
                    scName: option[0],
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
        />
      )}
    </>
  )
}
