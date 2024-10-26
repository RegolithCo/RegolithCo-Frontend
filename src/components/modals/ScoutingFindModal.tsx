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
  Typography,
  useMediaQuery,
} from '@mui/material'

import {
  RockStateEnum,
  ScoutingFind,
  ScoutingFindStateEnum,
  ShipClusterFind,
  ShipMiningOrderCapture,
  ShipRock,
  ShipRockCapture,
} from '@regolithco/common'
import { ScoutingFindCalc } from '../calculators/ScoutingFindCalc'
import { scoutingFindStateThemes } from '../../theme'
import { BackHand, Camera, Cancel, Create, Delete, DocumentScanner, Save } from '@mui/icons-material'
import { ScoutingFindContext } from '../../context/scoutingFind.context'
import { ConfirmModal } from './ConfirmModal'
import { ExportImageIcon } from '../../icons/badges'
import { DeleteScoutingFindModal } from './DeleteScoutingFindModal'
import { CameraControl, CameraControlProps } from '../ocr/CameraControl'
import log from 'loglevel'

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
  const [camScanModal, setCamScanModal] = React.useState<CameraControlProps['mode'] | null>(null)

  const [theme, setTheme] = React.useState<Theme>(
    scoutingFindStateThemes[scoutingFind.state || ScoutingFindStateEnum.Discovered]
  )
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
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

  const handleCapture = <T extends ShipRockCapture | ShipMiningOrderCapture>(data: T): void => {
    const capturedRock = data as ShipRockCapture
    log.info('MARZIPAN Captured Ship Rock', capturedRock)
    if (newScoutingFind.clusterType !== 'SHIP') return
    const shipFind = newScoutingFind as ShipClusterFind
    // Add this rock to the list
    const newRock = {
      mass: capturedRock.mass || 0,
      inst: capturedRock.inst || 0,
      res: capturedRock.res || 0,
      ores: capturedRock.ores.map((ore) => ({
        ore: ore.ore,
        percent: ore.percent,
        __typename: 'ShipRockOre',
      })),
      state: RockStateEnum.Ready,
      __typename: 'ShipRock',
    } as ShipRock
    const newRocks = [...shipFind.shipRocks, newRock]
    setNewScoutingFind({
      ...newScoutingFind,
      shipRocks: newRocks,
    } as ShipClusterFind)
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
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: 'blur(1px)',
            },
          },
        }}
      >
        {camScanModal && (
          <CameraControl
            captureType="SHIP_ROCK"
            mode={camScanModal}
            onClose={() => setCamScanModal(null)}
            onCapture={handleCapture}
          />
        )}
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
            justifyContent: 'space-between',
            borderTop: `2px solid ${theme.palette.primary.main}`,
          }}
        >
          <Button
            color="error"
            variant="text"
            size={isSmall ? 'small' : 'large'}
            startIcon={!isSmall && <Cancel />}
            onClick={handleConfirmClose}
          >
            {isNew ? 'Cancel' : 'Close'}
          </Button>
          <div style={{ flexGrow: 1 }} />
          {!isSmall && allowEdit && (
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 700 }}>
              Auto Add Rock:
            </Typography>
          )}
          {allowEdit && (
            <Tooltip title="Import a rock scan using your device's camera." placement="top">
              <Button
                size={isSmall ? 'small' : 'large'}
                startIcon={<Camera />}
                color="inherit"
                variant="contained"
                onClick={() => {
                  setCamScanModal('Camera')
                }}
              >
                {isSmall ? 'Cam' : 'Camera'}
              </Button>
            </Tooltip>
          )}
          {allowEdit && (
            <Tooltip title="Import a rock scan using a game screenshot." placement="top">
              <Button
                size={isSmall ? 'small' : 'large'}
                startIcon={<DocumentScanner />}
                color="inherit"
                variant="contained"
                onClick={() => {
                  setCamScanModal('File')
                }}
              >
                {isSmall ? 'Screenshot' : 'Screenshot'}
              </Button>
            </Tooltip>
          )}
          <div style={{ flexGrow: 1 }} />
          {allowDelete && onDelete && (
            <Button
              variant="outlined"
              size={isSmall ? 'small' : 'large'}
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
              size={isSmall ? 'small' : 'large'}
              startIcon={isSmall ? undefined : isNew ? <Create /> : <Save />}
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
