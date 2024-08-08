import * as React from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  IconButton,
  SxProps,
  Theme,
  ThemeProvider,
  Tooltip,
  useMediaQuery,
} from '@mui/material'

import { ScoutingFind, ScoutingFindStateEnum } from '@regolithco/common'
import { ScoutingFindCalc } from '../calculators/ScoutingFindCalc'
import { scoutingFindStateThemes } from '../../theme'
import { BackHand, Cancel, Create, Delete, Save } from '@mui/icons-material'
import { ScoutingFindContext } from '../../context/scoutingFind.context'
import { ConfirmModal } from './ConfirmModal'
import { ExportImageIcon } from '../../icons/badges'
import { DeleteScoutingFindModal } from './DeleteScoutingFindModal'

export interface ScoutingFindModalProps {
  open: boolean
  setShareScoutingFindId?: (id: string) => void
  onClose: () => void
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  dialog: {
    '& .MuiDialog-paper': {
      borderRadius: 10,
      border: `8px solid ${theme.palette.primary.main}`,
      [theme.breakpoints.down('md')]: {
        borderRadius: 0,
      },
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

export const ScoutingFindModal: React.FC<ScoutingFindModalProps> = ({ open, setShareScoutingFindId, onClose }) => {
  // This is just used int he live case. In every other case we just edit it live
  const {
    scoutingFind,
    isNew,
    onChange,
    allowDelete,
    onDelete,
    joinScoutingFind,
    leaveScoutingFind,
    meUser,
    allowEdit,
  } = React.useContext(ScoutingFindContext)
  const [confirmCloseModal, setConfirmCloseModal] = React.useState<boolean>(false)
  const [newScoutingFind, setNewScoutingFind] = React.useState<ScoutingFind>(scoutingFind)
  const [deleteConfirmModal, setDeleteConfirmModal] = React.useState<boolean>(false)
  const [theme, setTheme] = React.useState<Theme>(
    scoutingFindStateThemes[scoutingFind.state || ScoutingFindStateEnum.Discovered]
  )
  const mediumUp = useMediaQuery(theme.breakpoints.up('md'))
  React.useEffect(() => {
    setNewScoutingFind(scoutingFind)
  }, [scoutingFind])
  // Make sure to update the theme correctly
  React.useEffect(() => {
    setTheme(scoutingFindStateThemes[newScoutingFind.state || ScoutingFindStateEnum.Discovered])
  }, [newScoutingFind])

  const handleConfirmClose = () => {
    if (isNew) {
      setConfirmCloseModal(true)
    } else {
      onClose()
    }
  }

  if (!scoutingFind) return null

  const styles = stylesThunk(theme)
  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={handleConfirmClose}
        fullWidth
        fullScreen={!mediumUp}
        maxWidth="md"
        disableEscapeKeyDown
        sx={styles.dialog}
      >
        <Box sx={styles.boxContainer}>
          {/* SHARE BUTTON */}
          {!isNew && setShareScoutingFindId && (
            <Box
              sx={{
                position: 'absolute',
                right: '2rem',
              }}
            >
              <Tooltip title="Share this scouting find" placement="top">
                <IconButton color="primary" onClick={() => setShareScoutingFindId(scoutingFind?.scoutingFindId)}>
                  <ExportImageIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          <ScoutingFindCalc
            scoutingFind={isNew ? newScoutingFind : scoutingFind}
            isNew={isNew}
            allowEdit={allowEdit}
            joinScoutingFind={joinScoutingFind}
            leaveScoutingFind={leaveScoutingFind}
            me={meUser}
            onChange={(newFind) => {
              if (isNew) setNewScoutingFind(newFind)
              else onChange(newFind)
            }}
          />
        </Box>
        <DialogActions
          sx={{
            //
            backgroundColor: theme.palette.background.default,
            flex: '0 0',
            px: 3,
            borderTop: `2px solid ${theme.palette.primary.main}`,
          }}
        >
          <Button color="error" variant="text" size="small" startIcon={<Cancel />} onClick={handleConfirmClose}>
            {isNew ? 'Cancel' : 'Close'}
          </Button>
          <div style={{ flexGrow: 1 }} />
          {allowDelete && onDelete && (
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

        <DeleteScoutingFindModal
          onClose={() => setDeleteConfirmModal(false)}
          open={deleteConfirmModal}
          onConfirm={() => {
            if (!allowDelete) return
            onDelete && onDelete()
            setDeleteConfirmModal(false)
            onClose()
          }}
        />
        <ConfirmModal
          open={confirmCloseModal}
          onClose={() => setConfirmCloseModal(false)}
          message="Are you sure you want to close this window? Any unsaved changes will be lost."
          title="Discard Changes?"
          onConfirm={() => {
            setConfirmCloseModal(false)
            onClose()
          }}
          cancelBtnText="Keep editing"
          confirmBtnText="Discard"
          cancelIcon={<BackHand />}
          confirmIcon={<Delete />}
        />
      </Dialog>
    </ThemeProvider>
  )
}
