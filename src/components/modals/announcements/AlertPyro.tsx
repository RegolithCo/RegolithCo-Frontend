import * as React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, useTheme } from '@mui/material'
import { Newspaper } from '@mui/icons-material'
import { fontFamilies } from '../../../theme'

export interface Alert319Props {
  open: boolean
  onClose: () => void
}

export const AlertPyro: React.FC<Alert319Props> = ({ open, onClose }) => {
  const theme = useTheme()
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
        <Newspaper
          sx={{
            fontSize: 30,
            position: 'absolute',
            left: 20,
            top: 15,
          }}
        />
        3.21, 3.21.1, 3.22 and the road to Pyro
      </DialogTitle>
      <DialogContent>
        <Typography paragraph>CitizenCon 2023 was very exciting for many reasons:</Typography>
        <Typography paragraph component="div" variant="caption">
          <ul>
            <li>Pyro!</li>
            <li>New ships</li>
            <li>Squadron 42 is feature complete</li>
            <li>Server meshing</li>
          </ul>
        </Typography>
        <Typography paragraph>
          Now that Squadron 42 is feature complete it is widely thought that a lot of that effort will be focused back
          on the persistent universe. <strong>THIS IS A GOOD THING</strong> ... but it does mean that we're going to see
          a lot of changes while Pyro, server meshing and a bunch of SQ42 features make their way into the PU. over.
        </Typography>
        <Typography paragraph fontWeight={'bold'}>
          What does this mean for Regolith?
        </Typography>
        <Typography paragraph>
          Probably good things in the long term but a lot of work and potential change in the short term. We're going to
          need to find new ways to adapt to changing conditions and parameters.{' '}
        </Typography>
        <Typography paragraph component="div">
          We'll do our best to keep everyone updated but for now our focus needs to be two-fold:
          <ol>
            <li>Keeping the current version of Regolith useful to the most number of people from now until 4.0</li>
            <li>Preparing a new branch (Regolithocati?) to try to keep up with the new changes.</li>
          </ol>
        </Typography>
        <Typography paragraph>
          Also it's probably a good bet that 4.0 will be a complete PU reset so if that happens Regolith will also
          likely do a complete wipe of server data so we don't have to support legacy code.
        </Typography>
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
