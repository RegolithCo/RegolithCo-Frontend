import React from 'react'
import {
  TableRow,
  TableCell,
  Tooltip,
  Checkbox,
  TextField,
  IconButton,
  SelectChangeEvent,
  Select,
  MenuItem,
  useTheme,
  alpha,
  Typography,
} from '@mui/material'
import {
  ShareAmtArr,
  UserSuggest,
  CrewShare,
  ShareTypeEnum,
  ShareTypeToolTip,
  SessionRoleEnum,
  ShipRoleEnum,
  WorkOrderExpense,
} from '@regolithco/common'
import { Toll as TollIcon, PieChart as PieChartIcon, Percent, Cancel, Description, NoteAdd } from '@mui/icons-material'
import { MValue, MValueFormat } from '../MValue'
import numeral from 'numeral'
import { fontFamilies } from '../../../theme'
import log from 'loglevel'
import { NoteAddDialog } from '../../modals/NoteAddDialog'
import { AppContext } from '../../../context/app.context'
import { SessionRoleIconBadge } from '../SessionRoleChooser'
import { ShipRoleIconBadge } from '../ShipRoleChooser'
import { debounce } from 'lodash'
import { DeleteModal } from '../../modals/DeleteModal'

export type CrewShareTableRowProps = {
  crewShare: CrewShare
  expenses: WorkOrderExpense[]
  payoutSummary: ShareAmtArr
  remainder: bigint
  numSharesTotal: number
  isMandatory?: boolean
  allowPay?: boolean
  isSessionRow?: boolean
  isMe?: boolean
  isShare?: boolean
  isSeller?: boolean
  allowEdit?: boolean
  isEditing?: boolean
  includeTransferFee?: boolean
  onChange: (newCrewShare: CrewShare) => void
  markCrewSharePaid?: (crewShare: CrewShare, paid: boolean) => void
  onDelete: () => void
  userSuggest?: UserSuggest
}

export const CrewShareTableRow: React.FC<CrewShareTableRowProps> = ({
  crewShare,
  expenses,
  payoutSummary,
  isMe,
  isSeller,
  remainder,
  allowEdit,
  isShare,
  isEditing,
  allowPay,
  isMandatory,
  isSessionRow,
  numSharesTotal,
  includeTransferFee,
  userSuggest,
  onChange,
  markCrewSharePaid,
  onDelete,
}) => {
  const theme = useTheme()
  const { getSafeName } = React.useContext(AppContext)
  const [editingShare, setEditingShare] = React.useState<boolean>(false)
  const [openNoteDialog, setOpenNoteDialog] = React.useState<boolean>(false)
  const [confirmDeleteCrewShareExpense, setConfirmDeleteCrewShareExpense] = React.useState<boolean>(false)

  const paid = Boolean(isSeller ? true : crewShare?.state)

  const tooltip = isMandatory
    ? 'The session owner has made this row mandatory'
    : isSessionRow
      ? 'The session owner has suggested this row. You can change it if you want.'
      : ''

  const paidToolTip = isMe
    ? `This is you. ${isSeller ? 'You are the seller and are always paid' : ''}`
    : isSeller
      ? `The seller. The seller is always paid`
      : ''
  // : `This fee is ${crewShare?.state ? 'Paid' : 'Unpaid'}`

  const userWithRoles = userSuggest && userSuggest[crewShare.payeeScName]

  // const fgColor = isMe ? 'inherit' : isMandatory ? '#db5ae9' : isSessionRow ? '#69c9e1' : 'inherit'
  const backgroundColor = isSeller ? '#55555555' : isMandatory ? '#7444751f' : isSessionRow ? '#29434c11' : 'inherit'
  const hasNote = crewShare.note && crewShare.note.length > 0
  const finalPayout: ShareAmtArr = !payoutSummary
    ? [0n, 0n, 0n]
    : isSeller
      ? [payoutSummary[0] + (remainder || 0n), payoutSummary[1] + (remainder || 0n), 0n]
      : payoutSummary
  return (
    <>
      <Tooltip title={tooltip} arrow placement="left" enterDelay={1000}>
        <TableRow sx={{ background: backgroundColor }}>
          <TableCell>{isSeller ? getSafeName(crewShare.payeeScName) : getSafeName(crewShare.payeeScName)}</TableCell>
          <TableCell padding="none">
            <ShipRoleIconBadge
              key="sessionRole"
              role={userWithRoles?.shipRole as ShipRoleEnum}
              sx={{
                fontSize: '1rem',
              }}
            />
          </TableCell>
          <TableCell padding="none">
            <SessionRoleIconBadge
              key="sessionRole"
              role={userWithRoles?.sessionRole as SessionRoleEnum}
              sx={{
                fontSize: '1rem',
              }}
            />
          </TableCell>

          {isEditing && !isMandatory ? (
            <CrewShareTypeEdit crewShare={crewShare} onChange={onChange} />
          ) : (
            formatCrewShareType(crewShare)
          )}
          {formatCrewShare(crewShare, onChange, Boolean(isEditing && !isMandatory), editingShare, setEditingShare)}

          {isSeller ? formatPayout(finalPayout, false) : formatPayout(finalPayout, Boolean(includeTransferFee))}

          {!isShare && !isEditing && (
            <Tooltip placement="top" arrow enterDelay={2000} title={!isEditing ? paidToolTip : ''}>
              <TableCell align="center" padding="none" width={30}>
                <Checkbox
                  checked={paid}
                  disabled={isSeller || !allowPay}
                  onChange={(e) => {
                    if (markCrewSharePaid) markCrewSharePaid(crewShare, e.target.checked)
                  }}
                />
              </TableCell>
            </Tooltip>
          )}

          {!isShare && (
            <TableCell align="center" padding="none" width={30}>
              {(!isEditing || isMandatory) && hasNote && (
                <Tooltip arrow title={`NOTE: ${crewShare.note}`} placement="top">
                  <div>
                    <Description color="primary" />
                  </div>
                </Tooltip>
              )}
              {isEditing && !isMandatory && (
                <Tooltip title="Add a note" arrow placement="top" enterDelay={2000}>
                  <IconButton
                    size="small"
                    sx={{
                      cursor: 'pointer',
                      color: hasNote ? theme.palette.primary.main : 'inherit',
                      '& :hover': { color: theme.palette.primary.main },
                    }}
                    onClick={() => setOpenNoteDialog(true)}
                  >
                    <NoteAdd />
                  </IconButton>
                </Tooltip>
              )}
            </TableCell>
          )}

          {isEditing && (
            <TableCell align="center" padding="none" width={30}>
              {!isSeller && !isMandatory && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => {
                    if (expenses.find((expense) => expense.ownerScName === crewShare.payeeScName)) {
                      setConfirmDeleteCrewShareExpense(true)
                    } else {
                      onDelete()
                    }
                  }}
                >
                  <Cancel />
                </IconButton>
              )}
            </TableCell>
          )}
        </TableRow>
      </Tooltip>

      {confirmDeleteCrewShareExpense && (
        <DeleteModal
          open
          title="Delete Crew Share"
          confirmBtnText="Delete"
          message={
            <Typography>
              This crew share has one or more expenses associated with it. Are you sure you want to delete them?
            </Typography>
          }
          onClose={() => setConfirmDeleteCrewShareExpense(false)}
          onConfirm={() => {
            onDelete()
            setConfirmDeleteCrewShareExpense(false)
          }}
        />
      )}

      {/* NOTE DIALOG */}
      {openNoteDialog && (
        <NoteAddDialog
          title={`Note for / about: ${getSafeName(crewShare.payeeScName)}`}
          open
          onClose={() => setOpenNoteDialog(false)}
          note={crewShare.note as string}
          onChange={(note) => {
            onChange({ ...crewShare, note })
          }}
        />
      )}
    </>
  )
}

export const crewShareTypeIcons: Record<ShareTypeEnum, React.ReactElement> = {
  [ShareTypeEnum.Amount]: <TollIcon sx={{ fontSize: '1em' }} />,
  [ShareTypeEnum.Percent]: <Percent sx={{ fontSize: '1em' }} />,
  [ShareTypeEnum.Share]: <PieChartIcon sx={{ fontSize: '1em' }} />,
}

export interface CrewShareTypeEditProps {
  crewShare: CrewShare
  onChange: (newCrewShare: CrewShare) => void
}

export const CrewShareTypeEdit: React.FC<CrewShareTypeEditProps> = ({ crewShare, onChange }): React.ReactElement => {
  const theme = useTheme()

  return (
    <TableCell align="right" valign="middle" padding="none">
      <Select
        labelId="share-type"
        id="shareType"
        size="small"
        variant="standard"
        value={crewShare.shareType}
        renderValue={(value) => crewShareTypeIcons[value as ShareTypeEnum]}
        onChange={(event: SelectChangeEvent) => {
          const newVal = event.target.value as ShareTypeEnum
          if (newVal === crewShare.shareType) return
          if (newVal === ShareTypeEnum.Amount) {
            onChange({ ...crewShare, share: 10000, shareType: ShareTypeEnum.Amount })
          } else if (newVal === ShareTypeEnum.Percent) {
            onChange({ ...crewShare, share: 0.1, shareType: ShareTypeEnum.Percent })
          } else {
            onChange({ ...crewShare, share: 1, shareType: ShareTypeEnum.Share })
          }
        }}
      >
        <Typography
          variant="overline"
          component="div"
          sx={{
            px: 2,
            fontWeight: 'bold',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }}
        >
          Share Type
        </Typography>
        <MenuItem value={ShareTypeEnum.Share}>
          <PieChartIcon sx={{ my: 1, mr: 2 }} /> Equal Share
        </MenuItem>
        <MenuItem value={ShareTypeEnum.Amount}>
          <TollIcon sx={{ my: 1, mr: 2 }} /> Flat Rate
        </MenuItem>
        <MenuItem value={ShareTypeEnum.Percent}>
          <Percent sx={{ my: 1, mr: 2 }} /> Percentage
        </MenuItem>
      </Select>
    </TableCell>
  )
}

const formatCrewShareType = (crewShare: CrewShare): React.ReactElement => {
  const shareIcon = crewShareTypeIcons[crewShare.shareType]
  return (
    <Tooltip arrow title={`Share type: ${ShareTypeToolTip[crewShare.shareType]}`} placement="top">
      <TableCell align="right" valign="middle" padding="none">
        {shareIcon}
      </TableCell>
    </Tooltip>
  )
}

export const formatCrewShare = (
  crewShare: CrewShare,
  onChange: (newCrewShare: CrewShare) => void,
  allowEdit: boolean,
  editingField: boolean,
  setEditingField: (editing: boolean) => void
): React.ReactElement => {
  const theme = useTheme()
  const [valError, setValError] = React.useState<boolean>(false)
  let shareVal: React.ReactElement
  switch (crewShare.shareType) {
    case ShareTypeEnum.Amount:
      shareVal = <MValue value={crewShare.share} format={MValueFormat.number_sm} decimals={0} />
      break
    case ShareTypeEnum.Percent:
      shareVal = <MValue value={crewShare.share} format={MValueFormat.percent} maxDecimals={2} />
      break
    case ShareTypeEnum.Share:
      shareVal = <MValue value={crewShare.share} format={MValueFormat.number} maxDecimals={2} />
      break
    default:
      shareVal = <MValue value={crewShare.share} format={MValueFormat.number} />
      break
  }

  const onTextChangeDebounced = React.useCallback(
    (newCrewShare: CrewShare) => {
      debounce(onChange, 500)(newCrewShare)
    },
    [onChange]
  )

  const defaultVal = crewShare.shareType === ShareTypeEnum.Percent ? 100 * (crewShare.share || 0) : crewShare.share
  return (
    <TableCell
      align="right"
      valign="middle"
      padding="none"
      sx={{
        pl: 0.5,
        color: theme.palette.text.secondary,
        cursor: allowEdit && !editingField ? 'pointer' : 'inherit',
        '&:hover': {
          background: allowEdit && !editingField ? alpha(theme.palette.primary.dark, 0.2) : 'inherit',
          color: allowEdit && !editingField ? theme.palette.primary.main : theme.palette.text.secondary,
        },
      }}
      onClick={() => {
        if (allowEdit && !editingField) setEditingField(true)
      }}
    >
      {!editingField && shareVal}
      {editingField && (
        <TextField
          autoFocus
          defaultValue={defaultVal}
          size="small"
          error={valError}
          onFocus={(event) => {
            event.target.select()
          }}
          onChange={(e) => {
            let newTargetVal = e.target.value
            if (e.target.value.trim() === '') {
              newTargetVal = '0'
            }
            try {
              let tValParsed = parseFloat(newTargetVal)
              // Round to 2 decimal places
              tValParsed = Math.round(tValParsed * 100) / 100

              if (crewShare.shareType === ShareTypeEnum.Amount) {
                // Verify that the value is >0 and an integer
                if (tValParsed >= 0 && Number.isInteger(tValParsed)) {
                  if (valError) setValError(false)
                  onTextChangeDebounced({ ...crewShare, share: Math.round(tValParsed) })
                } else {
                  setValError(true)
                }
              } else if (crewShare.shareType === ShareTypeEnum.Percent) {
                if (tValParsed >= 0 && tValParsed <= 100) {
                  if (valError) setValError(false)
                  onTextChangeDebounced({ ...crewShare, share: tValParsed / 100 })
                } else {
                  setValError(true)
                }
              } else if (crewShare.shareType === ShareTypeEnum.Share) {
                if (tValParsed >= 0) {
                  if (valError) setValError(false)
                  onTextChangeDebounced({ ...crewShare, share: tValParsed })
                } else {
                  setValError(true)
                }
              }
            } catch (e) {
              setValError(true)
              log.error(e)
            }
          }}
          onBlur={() => setEditingField(false)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              // Set next cell down to edit mode
              event.preventDefault()
              setEditingField(false)
            } else if (event.key === 'Tab') {
              event.preventDefault()
              // Set next cell down to edit mode
              setEditingField(false)
            } else if (event.key === 'Escape') {
              event.preventDefault()
              setEditingField(false)
            }
            // handle any punctuation keys like *().,;'"" but allow escape keys like enter
            else if (event.key.length === 1 && !event.key.match(/[0-9.]/)) {
              event.preventDefault()
            }
          }}
          inputProps={{
            sx: {
              p: 0,
              textAlign: 'right',
              fontFamily: fontFamilies.robotoMono,
            },
          }}
        />
      )}
    </TableCell>
  )
}

const formatPayout = (shareArr: ShareAmtArr, includeTfr?: boolean): React.ReactNode => {
  const theme = useTheme()
  let tooltip = ''
  if (includeTfr) {
    tooltip = `= ${numeral(shareArr[0]).format('0,0')} payout - ${numeral(shareArr[0] - shareArr[1]).format(
      '0,0'
    )} transfer fee`
  } else {
    tooltip = `= ${numeral(shareArr[0]).format('0,0')} payout`
  }
  return (
    <Tooltip title={tooltip} arrow enterDelay={2000} placement="top">
      <TableCell
        align="right"
        padding="none"
        sx={{
          pl: 0.5,
          color: theme.palette.primary.light,
        }}
      >
        <MValue
          value={shareArr[1]}
          format={MValueFormat.number}
          typoProps={{
            color: shareArr[1] >= 0 ? theme.palette.primary.light : 'error',
          }}
        />
      </TableCell>
    </Tooltip>
  )
}
