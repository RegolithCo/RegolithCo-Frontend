import * as React from 'react'

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
  Typography,
  useTheme,
} from '@mui/material'
import { Stack } from '@mui/system'
import { Cancel, Save } from '@mui/icons-material'
import { ScoutingFindTypeEnum } from '@regolithco/common'
import { fontFamilies } from '../../theme'

export interface ScoutingClusterCountModalProps {
  open: boolean
  clusterCount: number
  clusterType: ScoutingFindTypeEnum
  isNew?: boolean
  onClose: () => void
  onSave: (newValue: number) => void
}

export const ScoutingClusterCountModal: React.FC<ScoutingClusterCountModalProps> = ({
  open,
  clusterCount,
  clusterType,
  onClose,
  onSave,
}) => {
  const [newClusterCount, setNewClusterCount] = React.useState<number>((clusterCount as number) || 1)
  const theme = useTheme()

  let itemName = 'rocks'
  switch (clusterType) {
    case ScoutingFindTypeEnum.Ship:
      itemName = 'rocks'
      break
    case ScoutingFindTypeEnum.Vehicle:
      itemName = 'gems'
      break
    case ScoutingFindTypeEnum.Salvage:
      itemName = 'wrecks'
      break
  }

  React.useEffect(() => {
    setNewClusterCount(clusterCount || 1)
  }, [clusterCount])

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        Number of {itemName}
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
          value={newClusterCount || 1}
          valueLabelDisplay="off"
          onChange={(event: Event, newValue: number | number[]) => {
            if (typeof newValue === 'number') {
              setNewClusterCount(newValue)
            }
          }}
          step={1}
          min={1}
          max={16}
        />
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
              onSave(newClusterCount)
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
