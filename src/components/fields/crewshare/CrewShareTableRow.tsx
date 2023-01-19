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
  Box,
  useTheme,
} from '@mui/material'
import { ShareAmtArr, UserSuggest, CrewShare, ShareTypeEnum } from '@orgminer/common'
import { Toll as TollIcon, PieChart as PieChartIcon, Percent, Delete, Description, NoteAdd } from '@mui/icons-material'
import { MValue, MValueFormat } from '../MValue'
import numeral from 'numeral'
import { fontFamilies } from '../../../theme'
import log from 'loglevel'
import { NoteAddDialog } from '../../modals/NoteAddDialog'

export type CrewShareTableRowProps = {
  crewShare: CrewShare
  payoutSummary: ShareAmtArr
  remainder: number
  numSharesTotal: number
  isMandatory?: boolean
  allowPay?: boolean
  isSessionRow?: boolean
  isMe?: boolean
  allowEdit?: boolean
  isEditing?: boolean
  includeTransferFee?: boolean
  onChange: (newCrewShare: CrewShare) => void
  onSetCrewSharePaid?: (scName: string, paid: boolean) => void
  onDelete: () => void
  userSuggest?: UserSuggest
}

export const CrewShareTableRow: React.FC<CrewShareTableRowProps> = ({
  crewShare,
  payoutSummary,
  isMe,
  remainder,
  allowEdit,
  isEditing,
  allowPay,
  isMandatory,
  isSessionRow,
  numSharesTotal,
  includeTransferFee,
  onChange,
  onSetCrewSharePaid,
  onDelete,
}) => {
  const theme = useTheme()
  const [editingShare, setEditingShare] = React.useState<boolean>(false)
  const [openNoteDialog, setOpenNoteDialog] = React.useState<boolean>(false)
  const [newNote, setNewNote] = React.useState<string>(crewShare.note || '')

  const paid = Boolean(isMe ? true : crewShare?.state)

  const tooltip = isMandatory
    ? 'The session owner has made this row mandatory'
    : isSessionRow
    ? 'The session owner has suggested this row. You can change it if you want.'
    : ''

  const fgColor = isMe ? 'inherit' : isMandatory ? '#db5ae9' : isSessionRow ? '#69c9e1' : 'inherit'
  const backgroundColor = isMe ? '#55555555' : isMandatory ? '#7444751f' : isSessionRow ? '#29434c11' : 'inherit'
  const hasNote = crewShare.note && crewShare.note.length > 0
  const finalPayout: ShareAmtArr = isMe
    ? [payoutSummary[0] + (remainder || 0), payoutSummary[1] + (remainder || 0), 0]
    : payoutSummary
  return (
    <>
      <Tooltip title={tooltip}>
        <TableRow sx={{ background: backgroundColor, '& *': { color: fgColor } }}>
          {isMe && <TableCell>{crewShare.scName}</TableCell>}
          {!isMe && <TableCell>{crewShare.scName}</TableCell>}

          {isEditing && !isMandatory ? formatCrewShareTypeEdit(crewShare, onChange) : formatCrewShareType(crewShare)}
          {formatCrewShare(crewShare, onChange, Boolean(isEditing && !isMandatory), editingShare, setEditingShare)}

          {isMe ? formatPayout(finalPayout, false) : formatPayout(finalPayout, Boolean(includeTransferFee))}

          <Tooltip
            title={isMe ? 'This is you. You are always paid.' : `This fee is ${crewShare?.state ? 'Paid' : 'Unpaid'}`}
          >
            <TableCell align="center" padding="none">
              <Checkbox
                checked={paid}
                disabled={isMe || !allowPay}
                onChange={(e) => {
                  onSetCrewSharePaid && onSetCrewSharePaid(crewShare.scName, e.target.checked)
                }}
              />
            </TableCell>
          </Tooltip>

          <TableCell align="center" padding="none">
            {(!isEditing || isMandatory) && hasNote && (
              <Tooltip title={`NOTE: ${crewShare.note}`}>
                <div>
                  <Description color="primary" />
                </div>
              </Tooltip>
            )}
            {isEditing && !isMandatory && (
              <Tooltip title="Add a note">
                <Box sx={{}}>
                  <NoteAdd
                    sx={{ color: hasNote ? theme.palette.primary.main : 'inherit' }}
                    onClick={() => setOpenNoteDialog(true)}
                  />
                </Box>
              </Tooltip>
            )}
          </TableCell>

          {isEditing && (
            <TableCell align="center" padding="none">
              {!isMe && !isMandatory && (
                <IconButton size="small" onClick={onDelete}>
                  <Delete />
                </IconButton>
              )}
            </TableCell>
          )}
        </TableRow>
      </Tooltip>

      {/* NOTE DIALOG */}
      <NoteAddDialog
        title={`Note for: ${crewShare.scName}`}
        open={openNoteDialog}
        onClose={() => setOpenNoteDialog(false)}
        note={crewShare.note as string}
        onChange={(note) => {
          onChange({ ...crewShare, note })
        }}
      />
    </>
  )
}

const crewShareTypeIcons: Record<ShareTypeEnum, React.ReactElement> = {
  [ShareTypeEnum.Amount]: <TollIcon sx={{ fontSize: 12 }} />,
  [ShareTypeEnum.Percent]: <Percent sx={{ fontSize: 12 }} />,
  [ShareTypeEnum.Share]: <PieChartIcon sx={{ fontSize: 12 }} />,
}

const formatCrewShareTypeEdit = (
  crewShare: CrewShare,
  onChange: (newCrewShare: CrewShare) => void
): React.ReactElement => {
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
        <MenuItem value={ShareTypeEnum.Share}>
          <PieChartIcon sx={{ my: 2 }} /> Equal Share
        </MenuItem>
        <MenuItem value={ShareTypeEnum.Amount}>
          <TollIcon sx={{ my: 2 }} /> Flat Rate
        </MenuItem>
        <MenuItem value={ShareTypeEnum.Percent}>
          <Percent sx={{ my: 2 }} /> Percentage
        </MenuItem>
      </Select>
    </TableCell>
  )
}

const formatCrewShareType = (crewShare: CrewShare): React.ReactElement => {
  const shareIcon = crewShareTypeIcons[crewShare.shareType]
  return (
    <TableCell align="right" valign="middle" padding="none">
      {shareIcon}
    </TableCell>
  )
}

const formatCrewShare = (
  crewShare: CrewShare,
  onChange: (newCrewShare: CrewShare) => void,
  allowEdit: boolean,
  editing: boolean,
  setEditing: (editing: boolean) => void
): React.ReactElement => {
  let shareVal: React.ReactElement
  switch (crewShare.shareType) {
    case ShareTypeEnum.Amount:
      shareVal = <MValue value={crewShare.share} format={MValueFormat.number} />
      break
    case ShareTypeEnum.Percent:
      shareVal = <MValue value={crewShare.share} format={MValueFormat.percent} />
      break
    case ShareTypeEnum.Share:
      shareVal = <MValue value={crewShare.share} format={MValueFormat.number} decimals={0} />
      break
    default:
      shareVal = <MValue value={crewShare.share} format={MValueFormat.number} />
      break
  }

  return (
    <TableCell
      align="right"
      valign="middle"
      padding="none"
      onClick={() => {
        if (allowEdit && !editing) setEditing(true)
      }}
    >
      {!editing && shareVal}
      {editing && (
        <TextField
          autoFocus
          defaultValue={crewShare.shareType === ShareTypeEnum.Percent ? 100 * (crewShare.share || 0) : crewShare.share}
          size="small"
          onFocus={(event) => {
            event.target.select()
          }}
          onChange={(e) => {
            let newTargetVal = e.target.value
            if (e.target.value.trim() === '') {
              newTargetVal = '0'
            }
            try {
              const tValParsed = parseFloat(newTargetVal)
              if (crewShare.shareType === ShareTypeEnum.Amount && tValParsed >= 0) {
                onChange({ ...crewShare, share: Math.round(tValParsed) })
              } else if (crewShare.shareType === ShareTypeEnum.Percent && tValParsed >= 0 && tValParsed <= 100) {
                onChange({ ...crewShare, share: Math.round(tValParsed) / 100 })
              } else if (crewShare.shareType === ShareTypeEnum.Share && tValParsed >= 0) {
                onChange({ ...crewShare, share: Math.round(tValParsed) })
              }
            } catch (e) {
              log.error(e)
            }
          }}
          onBlur={() => setEditing(false)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              // Set next cell down to edit mode
              event.preventDefault()
              setEditing(false)
            } else if (event.key === 'Tab') {
              event.preventDefault()
              // Set next cell down to edit mode
              setEditing(false)
            } else if (event.key === 'Escape') {
              event.preventDefault()
              setEditing(false)
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
  let tooltip = ''
  if (includeTfr) {
    tooltip = `= ${numeral(shareArr[0]).format('0,0')} payout - ${numeral(shareArr[0] - shareArr[1]).format(
      '0,0'
    )} transfer fee`
  } else {
    tooltip = `= ${numeral(shareArr[0]).format('0,0')} payout`
  }
  return (
    <Tooltip title={tooltip}>
      <TableCell align="right" padding="none">
        <MValue value={shareArr[1]} format={MValueFormat.number} />
      </TableCell>
    </Tooltip>
  )
}
