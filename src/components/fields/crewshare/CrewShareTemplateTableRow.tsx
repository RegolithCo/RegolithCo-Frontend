import React from 'react'
import {
  TableRow,
  TableCell,
  TextField,
  IconButton,
  SelectChangeEvent,
  Select,
  MenuItem,
  Tooltip,
  Box,
  useTheme,
} from '@mui/material'
import { UserSuggest, ShareTypeEnum, CrewShareTemplate, CrewShareTemplateInput } from '@regolithco/common'
import { Toll as TollIcon, PieChart as PieChartIcon, Percent, Delete, NoteAdd } from '@mui/icons-material'
import { MValue, MValueFormat } from '../MValue'
import { fontFamilies } from '../../../theme'
import log from 'loglevel'
import { omit } from 'lodash'
import { NoteAddDialog } from '../../modals/NoteAddDialog'

export type CrewShareTemplateTableRowProps = {
  crewShare: CrewShareTemplate
  onChange: (newCrewShare: CrewShareTemplateInput) => void
  onDelete: () => void
  userSuggest?: UserSuggest
}

export const CrewShareTemplateTableRow: React.FC<CrewShareTemplateTableRowProps> = ({
  crewShare,
  onChange,
  onDelete,
}) => {
  const theme = useTheme()

  const [editingShare, setEditingShare] = React.useState<boolean>(false)
  const [openNoteDialog, setOpenNoteDialog] = React.useState<boolean>(false)
  const crewShareInput = omit(crewShare, ['__typename'])
  const hasNote = crewShare.note && crewShare.note.length > 0
  return (
    <>
      <TableRow>
        <TableCell padding="none">{crewShare.payeeScName}</TableCell>

        {formatCrewShareTypeEdit(crewShareInput, onChange)}
        {formatCrewShare(crewShareInput, onChange, editingShare, setEditingShare)}

        <TableCell align="center" padding="none">
          <Tooltip title="Add a note">
            <Box sx={{}}>
              <NoteAdd
                sx={{ color: hasNote ? theme.palette.primary.main : 'inherit' }}
                onClick={() => setOpenNoteDialog(true)}
              />
            </Box>
          </Tooltip>
        </TableCell>

        <TableCell align="center" padding="none">
          <IconButton size="small" onClick={onDelete}>
            <Delete />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* NOTE DIALOG */}
      <NoteAddDialog
        open={openNoteDialog}
        onClose={() => setOpenNoteDialog(false)}
        note={crewShare.note as string}
        onChange={(newNote) => {
          onChange({ ...crewShareInput, note: newNote })
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
  crewShare: CrewShareTemplateInput,
  onChange: (newCrewShare: CrewShareTemplateInput) => void
): React.ReactElement => {
  return (
    <TableCell align="center" padding="none">
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

const formatCrewShare = (
  crewShare: CrewShareTemplateInput,
  onChange: (newCrewShare: CrewShareTemplateInput) => void,
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
        if (!editing) setEditing(true)
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
