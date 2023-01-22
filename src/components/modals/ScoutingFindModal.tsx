import * as React from 'react'
import { Box, Button, Dialog, DialogActions, ThemeProvider } from '@mui/material'

import { ScoutingFind, ScoutingFindStateEnum, SessionUser } from '@regolithco/common'
import { ScoutingFindCalc } from '../calculators/ScoutingFindCalc'
import { scoutingFindStateThemes } from '../../theme'
import { omit } from 'lodash'
import { Cancel, Create, Delete, Save } from '@mui/icons-material'
import { DeleteModal } from './DeleteModal'

export interface ScoutingFindModalProps {
  open: boolean
  scoutingFind: ScoutingFind
  meUser: SessionUser
  onChange: (scoutingFind: ScoutingFind) => void
  onDelete?: () => void
  allowEdit?: boolean
  allowWork?: boolean
  isNew?: boolean
  onClose: () => void
}

export const ScoutingFindModal: React.FC<ScoutingFindModalProps> = ({
  open,
  scoutingFind,
  isNew,
  onChange,
  onDelete,
  meUser,
  allowWork,
  allowEdit,
  onClose,
}) => {
  // This is just used int he live case. In every other case we just edit it live
  const [newScoutingFind, setNewScoutingFind] = React.useState<ScoutingFind>(scoutingFind)
  const [deleteConfirmModal, setDeleteConfirmModal] = React.useState<boolean>(false)
  const theme = scoutingFindStateThemes[scoutingFind.state || ScoutingFindStateEnum.Discovered]

  React.useEffect(() => {
    setNewScoutingFind(scoutingFind)
  }, [scoutingFind])

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        disableEscapeKeyDown
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 10,
            border: `8px solid ${theme.palette.primary.dark}`,
          },
        }}
      >
        <Box
          sx={{
            overflow: 'hidden',
            height: '100%',
          }}
        >
          <ScoutingFindCalc
            scoutingFind={isNew ? newScoutingFind : scoutingFind}
            isNew={isNew}
            allowEdit={allowEdit}
            allowWork={allowWork}
            me={meUser}
            onChange={(newFind) => {
              if (isNew) setNewScoutingFind(newFind)
              else onChange(newFind)
            }}
            onDelete={onDelete}
          />
        </Box>
        <DialogActions sx={{ backgroundColor: theme.palette.primary.dark, flex: '0 0' }}>
          <Button
            color="error"
            variant="contained"
            size="large"
            startIcon={<Cancel />}
            onClick={() => {
              onClose()
            }}
          >
            {isNew ? 'Cancel' : 'Close'}
          </Button>
          <div style={{ flexGrow: 1 }} />
          {allowEdit && onDelete && (
            <Button
              variant="contained"
              startIcon={<Delete />}
              onClick={() => setDeleteConfirmModal(true)}
              color="error"
            >
              Delete
            </Button>
          )}
          {isNew && (
            <Button
              color="secondary"
              variant="contained"
              size="large"
              startIcon={isNew ? <Create /> : <Save />}
              onClick={() => {
                onChange(newScoutingFind)
                onClose()
              }}
            >
              {isNew ? 'Create' : 'Save'}
            </Button>
          )}
        </DialogActions>

        <DeleteModal
          title="Permanently DELETE this scouting find?"
          message="This action cannot be undone. You can also mark a find as abandoned or depleted and then filter those out."
          onClose={() => setDeleteConfirmModal(false)}
          open={deleteConfirmModal}
          onConfirm={() => {
            onDelete && onDelete()
            setDeleteConfirmModal(false)
            onClose()
          }}
          cancelBtnText="Oops.NO!"
          confirmBtnText="Yes, Delete"
        />
      </Dialog>
    </ThemeProvider>
  )
}
