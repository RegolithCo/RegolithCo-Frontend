import * as React from 'react'

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material'
import { Stack } from '@mui/system'
import { theme as defaultTheme } from '../../theme'
import { Agriculture, Cancel, PanTool, Save } from '@mui/icons-material'
import { ScoutingFindTypeEnum, VehicleOreEnum } from '@regolithco/common'
import { VehicleOreChooser } from '../fields/VehicleOreChooser'

export interface ScoutingClusterCountModalProps {
  open: boolean
  clusterCount: number
  numScans?: number
  clusterType: ScoutingFindTypeEnum
  isNew?: boolean
  onClose: () => void
  onSave: (newValue: number, vehicleGem?: VehicleOreEnum, gemSize?: number) => void
}

export const ScoutingClusterCountModal: React.FC<ScoutingClusterCountModalProps> = ({
  open,
  clusterCount,
  clusterType,
  numScans,
  onClose,
  onSave,
}) => {
  const [vehicleOre, setVehicleOre] = React.useState<VehicleOreEnum>(VehicleOreEnum.Hadanite)
  const [gemSize, setGemSize] = React.useState<string>('ROC')
  const [newClusterCount, setNewClusterCount] = React.useState<number>((clusterCount as number) || 1)
  const theme = useTheme()

  let itemName = 'rocks'
  switch (clusterType) {
    case ScoutingFindTypeEnum.Ship:
      itemName = 'mineable rocks'
      break
    case ScoutingFindTypeEnum.Vehicle:
      itemName = 'mineable rocks'
      break
    case ScoutingFindTypeEnum.Salvage:
      itemName = 'wrecks'
      break
  }

  const minVal = clusterType === ScoutingFindTypeEnum.Ship && numScans && numScans > 0 ? numScans : 1

  React.useEffect(() => {
    setNewClusterCount(clusterCount || minVal)
  }, [clusterCount, numScans, minVal])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          // [theme.breakpoints.up('md')]: {
          // },
          background: theme.palette.primary.dark,
          borderRadius: 5,
          border: `4px solid ${theme.palette.primary.dark}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          textTransform: 'uppercase',
          p: 1,

          background: theme.palette.primary.dark,
          color: theme.palette.primary.contrastText,
        }}
      >
        Total {itemName}
      </DialogTitle>
      <DialogContent
        sx={{
          p: 3,
          borderRadius: 7,
          background: theme.palette.background.default,
          outline: `4px solid ${theme.palette.primary.dark}`,
        }}
      >
        <Box sx={{ mt: 3 }}>
          <Typography
            component="div"
            sx={{
              fontSize: 40,
              borderRadius: '50%',
              margin: '0 auto',
              width: '70px',
              height: '70px',
              background: theme.palette.background.default,
              color: theme.palette.primary.main,
              lineHeight: '60px',
              fontWeight: 'bold',
              border: `4px solid ${theme.palette.primary.dark}`,
              textAlign: 'center',
            }}
          >
            {newClusterCount || clusterCount}
          </Typography>
        </Box>
        <Slider
          aria-label="Temperature"
          sx={{ pt: 4 }}
          size="medium"
          marks={[
            { value: 1, label: '1' },
            { value: 2, label: '' },
            { value: 3, label: '' },
            { value: 4, label: '4' },
            { value: 5, label: '' },
            { value: 6, label: '' },
            { value: 7, label: '' },
            { value: 8, label: '8' },
            { value: 9, label: '' },
            { value: 10, label: '' },
            { value: 11, label: '' },
            { value: 12, label: '12' },
            { value: 13, label: '' },
            { value: 14, label: '' },
            { value: 15, label: '' },
            { value: 16, label: '16' },
          ]}
          value={newClusterCount || numScans}
          valueLabelDisplay="off"
          onChange={(event: Event, newValue: number | number[]) => {
            if (typeof newValue === 'number') {
              if (newValue < minVal) {
                setNewClusterCount(minVal)
                return
              } else {
                setNewClusterCount(newValue)
              }
            }
          }}
          step={1}
          min={1}
          max={16}
        />
        {clusterType === ScoutingFindTypeEnum.Vehicle && (
          <>
            <Typography variant="overline" sx={{ mt: 2 }}>
              Ore Type:
            </Typography>
            <ThemeProvider theme={defaultTheme}>
              <VehicleOreChooser
                values={[vehicleOre]}
                requireValue
                onChange={(newValue: VehicleOreEnum[]) => {
                  if (newValue.length === 0) return
                  setVehicleOre(newValue[0])
                }}
              />
            </ThemeProvider>
            <Typography variant="overline" sx={{ mt: 2 }}>
              Rock size:
            </Typography>
            <Box sx={{ width: '100%', textAlign: 'center' }}>
              <ToggleButtonGroup
                exclusive
                value={gemSize}
                onChange={(event, newValue) => {
                  if (newValue === null) return
                  setGemSize(newValue)
                }}
              >
                <ToggleButton sx={{ flexGrow: 1 }} value="HAND">
                  <PanTool sx={{ mr: 1 }} /> Hand
                </ToggleButton>
                <ToggleButton sx={{ flexGrow: 1 }} value="ROC">
                  <Agriculture sx={{ mr: 1 }} /> Roc
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
          <Button color="error" onClick={onClose} variant="contained" startIcon={<Cancel />}>
            Cancel
          </Button>
          <div style={{ flexGrow: 1 }} />
          <Button
            color="primary"
            startIcon={<Save />}
            variant="contained"
            onClick={() => {
              onSave(newClusterCount, vehicleOre, gemSize === 'ROC' ? 0.15 : 0.05)
              onClose()
            }}
          >
            Save
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
