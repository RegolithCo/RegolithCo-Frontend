import * as React from 'react'

import { Box, Button, Dialog, DialogActions, DialogContent, SxProps, Theme, Typography, useTheme } from '@mui/material'
import { OreSummary, ShipRock } from '@regolithco/common'
import { RockIcon } from '../../icons'
import { Stack } from '@mui/system'
import { Cancel, Save } from '@mui/icons-material'

export const SHIP_ROCK_BOUNDS = [2000, 150000]

export interface StoreChooserModalProps {
  open?: boolean
  ores: OreSummary
  initStore?: string
  onClose: () => void
  onSubmit?: (newRock: ShipRock) => void
}

const styleThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  paper: {
    '& .MuiDialog-paper': {
      [theme.breakpoints.up('md')]: {
        minHeight: 550,
        maxHeight: 900,
        overflow: 'visible',
      },
      backgroundColor: '#282828ee',
      backgroundImage: 'none',
      borderRadius: 4,
      position: 'relative',
      outline: `10px solid ${theme.palette.primary.contrastText}`,
      border: `10px solid ${theme.palette.primary.main}`,
    },
  },
  dialogContent: {
    py: 1,
    px: 2,
    borderRadius: 3,
    outline: `10px solid ${theme.palette.primary.main}`,
  },
  headTitles: {
    // fontFamily: fontFamilies.robotoMono,
    fontWeight: 'bold',
    // lineHeight: 1.5,
    fontSize: '0.8rem',
    // textAlign: 'center',
    // p: 1,
    // my: 1,
    // color: theme.palette.secondary.light,
    // borderBottom: `3px solid ${theme.palette.secondary.main}`,
    // borderBottom: `3px dashed`,
  },
  headerBar: {
    color: theme.palette.primary.contrastText,
    background: theme.palette.primary.main,
    display: 'flex',
    justifyContent: 'space-between',
    px: 2,
    py: 1,
  },
})

export const StoreChooserModal: React.FC<StoreChooserModalProps> = ({ open, ores, initStore, onClose, onSubmit }) => {
  const theme = useTheme()
  const styles = styleThunk(theme)

  return (
    <>
      <Dialog open={Boolean(open)} onClose={onClose} sx={styles.paper} maxWidth="xs">
        <RockIcon sx={styles.icon} />
        <Box sx={styles.headerBar}>
          <Typography variant="h6" sx={styles.cardTitle}>
            Store Chooser
          </Typography>
        </Box>
        <DialogContent sx={styles.dialogContent}>
          <Typography variant="overline" sx={styles.headTitles} component="div">
            Choose a store
          </Typography>
        </DialogContent>
        <DialogActions sx={{ background: theme.palette.primary.main }}>
          <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
            <Button color="error" onClick={onClose} variant="contained" startIcon={<Cancel />}>
              Cancel
            </Button>
            <Button
              color="secondary"
              startIcon={<Save />}
              size="small"
              variant={'contained'}
              onClick={() => {
                //
              }}
            >
              Save
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  )
}
