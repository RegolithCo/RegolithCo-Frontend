import * as React from 'react'
import { Box, Button, Dialog, DialogActions, useTheme } from '@mui/material'

import { ScoutingFind } from '@regolithco/common'
import { ScoutingFindCalc } from '../calculators/ScoutingFindCalc'

export interface ScoutingFindModalProps {
  open: boolean
  scoutingFind: ScoutingFind
  onChange: (scoutingFind: ScoutingFind) => void
  allowEdit?: boolean
  isNew?: boolean
  onClose: () => void
}

export const ScoutingFindModal: React.FC<ScoutingFindModalProps> = ({
  open,
  scoutingFind,
  isNew,
  onChange,
  allowEdit,
  onClose,
}) => {
  const theme = useTheme()
  const [newScoutingFind, setNewScoutingFind] = React.useState<ScoutingFind>(scoutingFind)
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      disableEscapeKeyDown
      sx={{
        '& .MuiDialog-paper': {
          // backgroundColor: '#00000011',
          // backgroundImage: 'none',
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
        <ScoutingFindCalc scoutingFind={scoutingFind} />
      </Box>
      {/* <DialogActions sx={{ backgroundColor: theme.palette.primary.dark }}>
        <Button color="error" variant="contained" size="large" onClick={onClose}>
          {'Close'}
        </Button>
        <div style={{ flexGrow: 1 }} />
        <Button
          color="secondary"
          variant="contained"
          size="large"
          onClick={() => {
            onChange(newScoutingFind)
            onClose()
          }}
        >
          {isNew ? 'Submit' : 'Save'}
        </Button>
      </DialogActions> */}
    </Dialog>
  )
}
