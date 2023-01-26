import * as React from 'react'
import { Box, Button, Dialog, DialogActions, SxProps, Theme, ThemeProvider } from '@mui/material'

import { ScoutingFind, ScoutingFindStateEnum, SessionUser } from '@regolithco/common'
import { ScoutingFindCalc } from '../calculators/ScoutingFindCalc'
import { scoutingFindStateThemes } from '../../theme'
import { Cancel, Create, Delete, Save } from '@mui/icons-material'
import { DeleteModal } from './DeleteModal'

export interface ScoutingFindModalProps {
  open: boolean
  scoutingFind: ScoutingFind
  meUser: SessionUser
  onChange: (scoutingFind: ScoutingFind) => void
  onDelete?: () => void
  joinScoutingFind?: (findId: string, enRoute: boolean) => void
  leaveScoutingFind?: (findId: string) => void
  allowEdit?: boolean
  allowWork?: boolean
  isNew?: boolean
  onClose: () => void
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  dialog: {
    //     [theme.breakpoints.up('md')]: {
    '& .MuiDialog-paper': {
      borderRadius: 10,
      border: `8px solid ${theme.palette.primary.dark}`,
    },
  },
  boxContainer: {
    position: 'relative',
    overflow: 'hidden',
    overflowY: 'auto',
    [theme.breakpoints.up('md')]: {
      overflowY: 'hidden',
    },
    height: '100%',
  },
})

export const ScoutingFindModal: React.FC<ScoutingFindModalProps> = ({
  open,
  scoutingFind,
  isNew,
  onChange,
  onDelete,
  joinScoutingFind,
  leaveScoutingFind,
  meUser,
  allowWork,
  allowEdit,
  onClose,
}) => {
  // This is just used int he live case. In every other case we just edit it live
  const [newScoutingFind, setNewScoutingFind] = React.useState<ScoutingFind>(scoutingFind)
  const [deleteConfirmModal, setDeleteConfirmModal] = React.useState<boolean>(false)

  React.useEffect(() => {
    setNewScoutingFind(scoutingFind)
  }, [scoutingFind])
  if (!scoutingFind) return null
  const theme = scoutingFindStateThemes[scoutingFind.state || ScoutingFindStateEnum.Discovered]
  const styles = stylesThunk(theme)
  return (
    <ThemeProvider theme={theme}>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" disableEscapeKeyDown sx={styles.dialog}>
        <Box sx={styles.boxContainer}>
          <ScoutingFindCalc
            scoutingFind={isNew ? newScoutingFind : scoutingFind}
            isNew={isNew}
            allowEdit={allowEdit}
            allowWork={allowWork}
            joinScoutingFind={joinScoutingFind}
            leaveScoutingFind={leaveScoutingFind}
            me={meUser}
            onChange={(newFind) => {
              if (isNew) setNewScoutingFind(newFind)
              else onChange(newFind)
            }}
            onDelete={onDelete}
          />
        </Box>
        <DialogActions
          sx={{
            //
            backgroundColor: theme.palette.background.default,
            flex: '0 0',
            px: 3,
            borderTop: `2px solid ${theme.palette.primary.dark}`,
          }}
        >
          <Button
            color="error"
            variant="text"
            size="small"
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
              variant="outlined"
              size="small"
              startIcon={<Delete />}
              onClick={() => setDeleteConfirmModal(true)}
              color="error"
            >
              Delete
            </Button>
          )}
          <div style={{ flexGrow: 1 }} />
          {isNew && (
            <Button
              color="secondary"
              variant="contained"
              size="small"
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
