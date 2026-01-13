import * as React from 'react'

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
  Theme,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
  Stack,
  SxProps,
} from '@mui/material'
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

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  sizeBtn: {
    backgroundColor: theme.palette.primary.light,
    border: '2px solid transparent',
    color: theme.palette.primary.contrastText,
    fontSize: {
      xs: 10,
      sm: 12,
    },
    opacity: 0.3,

    '&:hover': {
      color: theme.palette.primary.contrastText,
      border: '2px solid white',
      opacity: 0.7,
      backgroundColor: theme.palette.primary.light,
    },
    '&.Mui-selected, &.Mui-selected:hover': {
      color: theme.palette.primary.contrastText,
      border: '2px solid white',
      opacity: 1,
      backgroundColor: theme.palette.primary.light,
    },
  },
})
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
  const styles = stylesThunk(theme)

  let itemName = 'rocks'
  let maxItems = 16
  switch (clusterType) {
    case ScoutingFindTypeEnum.Ship:
      itemName = 'mineable rocks'
      maxItems = 20
      break
    case ScoutingFindTypeEnum.Vehicle:
      itemName = 'mineable rocks'
      maxItems = 30
      break
    case ScoutingFindTypeEnum.Salvage:
      itemName = 'wrecks'
      maxItems = 16
      break
  }

  const marks = Array.from(Array(maxItems).keys()).map((i) => {
    const label = i == 0 || i == maxItems - 1 || (i + 1) % 4 == 0 ? i + 1 : ''
    return { value: i + 1, label }
  })

  const minVal = numScans && numScans > 0 ? numScans : 1

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
          background: theme.palette.primary.main,
          borderRadius: 5,
          border: `4px solid ${theme.palette.primary.main}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          textTransform: 'uppercase',
          p: 1,

          background: theme.palette.primary.main,
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
          outline: `4px solid ${theme.palette.primary.main}`,
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
              border: `4px solid ${theme.palette.primary.main}`,
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
          marks={marks}
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
          max={maxItems}
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
                <ToggleButton sx={styles.sizeBtn} value="HAND">
                  <PanTool sx={{ mr: 1 }} /> Hand Size
                </ToggleButton>
                <ToggleButton sx={styles.sizeBtn} value="ROC">
                  <Agriculture sx={{ mr: 1 }} /> ROC Size
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
            color="secondary"
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
