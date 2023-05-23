import * as React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, useTheme, Link } from '@mui/material'
import { Newspaper } from '@mui/icons-material'
import { fontFamilies } from '../../theme'

export interface Alert319Props {
  open: boolean
  onClose: () => void
}

export const Alert319: React.FC<Alert319Props> = ({ open, onClose }) => {
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
        3.19 and the new Meta
      </DialogTitle>
      <DialogContent>
        <Typography paragraph>
          Star Citizen 3.19 is here and with it a complete rework of the mining meta. In general this is all great news,
          very welcome and long overdue but it comes with a few downsides for tool developers.
        </Typography>
        <Typography paragraph>
          The biggest issue for 3rd-party tool developers is the removal of information sets from the game XML files. In
          the past we used these files to harvest price data, refinery yield calculations etc. As the Star Citizen
          universe becomes more dynamic these values will be stored server-side and subject to change via in-game
          forces.
        </Typography>
        <Typography paragraph>
          Again, we love that the universe is becoming more dynamic but without a public API wour tools need the data to
          be hand collected to work.{' '}
          <strong>
            CIG, if you're reading this we would love a public API for things like prices and store inventories.
          </strong>
        </Typography>
        <Typography paragraph>
          At Regolith we are going to try to evolve to keep up with these changes so here are the broad strokes.
          <ul>
            <li>
              <strong>Let us know</strong> if you see somethign weird. Regolith has an active{' '}
              <Link href="https://discord.gg/6TKSYHNJha" target="_blank">
                Discord Server
              </Link>{' '}
              with channels for Feature Requests, Bug Reports and general discussion.
            </li>
            <li>
              <strong>Prices calculations</strong> are now simply estimates. When you selll your ore make sure to enter
              what you ACTUALLY got for it using the new "final sell price" control.
            </li>
            <li>
              <strong>Market Data</strong> is now harvested from{' '}
              <Link href="https://uexcorp.space/" target="_blank">
                UEXCorp
              </Link>{' '}
              who have an excellent system for collecting this data. If you feel like signing up as a volunteer there
              I'm sure they'd appreciate it.
            </li>
            <li>
              <strong>Rock calculation</strong> and yields data are now dependent on the completeness of your scan. Try
              to enter every mineral % value to get the best yield estimates.
            </li>
          </ul>
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
