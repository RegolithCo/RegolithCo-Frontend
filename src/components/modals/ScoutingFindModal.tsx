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

import {
  RockStateEnum,
  ScoutingFind,
  ScoutingFindStateEnum,
  ScoutingFindTypeEnum,
  ShipClusterFind,
  ShipMiningOrderCapture,
  ShipOreEnum,
  ShipRock,
  ShipRockCapture,
  VehicleClusterFind,
} from '@regolithco/common'
import { ScoutingFindCalc } from '../calculators/ScoutingFindCalc'
import { scoutingFindStateThemes } from '../../theme'
import { BackHand, Cancel, Create, Delete, DocumentScanner, Save } from '@mui/icons-material'
import { ScoutingFindContext } from '../../context/scoutingFind.context'
import { ConfirmModal } from './ConfirmModal'
import { ExportImageIcon } from '../../icons/badges'
import { DeleteScoutingFindModal } from './DeleteScoutingFindModal'
import { CaptureControl } from '../ocr/CaptureControl'
import { useImagePaste } from '../../hooks/useImagePaste'

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
    pastedImgUrl,
    setPastedImgUrl,
  } = React.useContext(ScoutingFindContext)
  const [confirmCloseModal, setConfirmCloseModal] = React.useState<boolean>(false)
  const [newScoutingFind, setNewScoutingFind] = React.useState<ScoutingFind>(scoutingFind)
  const [deleteConfirmModal, setDeleteConfirmModal] = React.useState<boolean>(false)
  const [camScanModal, setCamScanModal] = React.useState<boolean>(!!pastedImgUrl)
  const [openCapture, setOpenCapture] = React.useState<number>()

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

  // Detect paste events and handle them as long as no modals are open
  useImagePaste((image) => {
    setPastedImgUrl && setPastedImgUrl(image)
    setCamScanModal(true)
  }, !setPastedImgUrl || camScanModal)

  const handleCapture = <T extends ShipRockCapture | ShipMiningOrderCapture>(data: T): void => {
    const capturedRock = data as ShipRockCapture

    if (newScoutingFind.clusterType !== 'SHIP') return
    const shipFind = newScoutingFind as ShipClusterFind

    // If this rock is part of a cluster then it is likely the same type as the rest of the rocks
    // in the cluster so let's find one
    const rockTypeDefault =
      shipFind.shipRocks.length > 0
        ? shipFind.shipRocks.find((rock) => rock.rockType)?.rockType || undefined
        : undefined

    // Add this rock to the list
    const newRock = {
      mass: capturedRock.mass || 0,
      inst: capturedRock.inst || 0,
      res: capturedRock.res || 0,
      rockType: capturedRock.rockType || rockTypeDefault,
      ores: capturedRock.ores.map((ore) => ({
        ore: ore.ore,
        percent: ore.percent,
        __typename: 'ShipRockOre',
      })),
      state: RockStateEnum.Ready,
      __typename: 'ShipRock',
    } as ShipRock
    const newRocks = [...shipFind.shipRocks, newRock]

    if (!newRock.ores.find((ore) => ore.ore === ShipOreEnum.Inertmaterial)) {
      // calculate the inert material
      const totalOres = newRock.ores.reduce((acc, ore) => acc + ore.percent, 0)
      const inertMaterial = totalOres >= 0 && totalOres <= 1 ? 1 - totalOres : 0
      newRock.ores.push({
        ore: ShipOreEnum.Inertmaterial,
        percent: inertMaterial,
        __typename: 'ShipRockOre',
      })
    }

    const newFind = {
      ...newScoutingFind,
      clusterCount: (shipFind.clusterCount || 0) < newRocks.length ? newRocks.length : shipFind.clusterCount,
      shipRocks: newRocks,
    } as ShipClusterFind

    if (isNew) setNewScoutingFind(newFind)
    else onChange(newFind)

    // Open the modal almost immediately
    setTimeout(() => {
      setOpenCapture(newFind.shipRocks.length - 1)
    }, 100)
  }

  if (!scoutingFind) return null

  const vehicleFind = newScoutingFind as VehicleClusterFind

  const disableSave =
    newScoutingFind.clusterType === ScoutingFindTypeEnum.Vehicle &&
    (!vehicleFind?.vehicleRocks || vehicleFind?.vehicleRocks.length === 0)

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
          <CaptureControl
            captureType="SHIP_ROCK"
            onClose={() => setCamScanModal(false)}
            onCapture={handleCapture}
            initialImageUrl={pastedImgUrl}
            sessionId={scoutingFind.sessionId}
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
            openCapture={openCapture}
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
          {allowEdit && scoutingFind.clusterType === ScoutingFindTypeEnum.Ship && (
            <Tooltip title="Import a rock scan using a game screenshot." placement="top">
              <Button
                size={isSmall ? 'small' : 'large'}
                startIcon={<DocumentScanner />}
                color="inherit"
                variant="contained"
                onClick={() => setCamScanModal(true)}
              >
                Add from Capture
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
              disabled={disableSave}
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
