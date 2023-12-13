import * as React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, useTheme } from '@mui/material'
import { fontFamilies } from '../../theme'
import { Stack } from '@mui/system'
import { MiningLoadout } from '@regolithco/common'
import { ImageDownloadComponent } from '../sharing/ImageDownloadComponent'
import { LoadoutCalc } from '../../components/calculators/LoadoutCalc/LoadoutCalc'
import { ExportImageIcon } from '../../icons/badges'

export interface LoadoutShareModalProps {
  loadout: MiningLoadout
  open: boolean
  onClose: () => void
}

export const LoadoutShareModal: React.FC<LoadoutShareModalProps> = ({ open, loadout, onClose }) => {
  const theme = useTheme()

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 10,
          boxShadow: `0px 0px 20px 5px ${theme.palette.primary.light}, 0px 0px 60px 40px black`,
          background: theme.palette.background.default,
          border: `10px solid ${theme.palette.primary.main}`,
          // px: 4,
          // py: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          position: 'relative',
          fontFamily: fontFamilies.robotoMono,
          fontWeight: 'bold',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          textAlign: 'center',
          mb: 2,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="center">
          <ExportImageIcon
            sx={{
              fontSize: 30,
              mr: 2,
              // position: 'absolute',
              // left: 20,
              // top: 15,
            }}
          />
          <Typography variant="h4">Share Loadout</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} alignItems="left" justifyContent="center">
          <ImageDownloadComponent
            fileName={`Regolith-loadout-${loadout.ship}-${loadout.name || 'MyLoadout'}`}
            widthPx={1000}
            leftContent={
              <Typography variant="body1">
                You can download a snapshot of this mining loadout and share it on social media or in discord.
              </Typography>
            }
          >
            <LoadoutCalc miningLoadout={loadout} isShare readonly />
          </ImageDownloadComponent>
        </Stack>
      </DialogContent>
      <DialogActions>
        <div style={{ flexGrow: 1 }} />
        <Button color="primary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
