import React from 'react'
import { Button, Typography, useTheme } from '@mui/material'
import { HelpModal } from '../../../modals/HelpModal'
import { Warning } from '@mui/icons-material'

export type UEXHelpDialogProps = {
  onClose?: () => void
}

export const UEXHelpDialog: React.FC<UEXHelpDialogProps> = ({ onClose }) => {
  const theme = useTheme()

  return (
    <HelpModal title="UEX and Best Price" onClose={onClose} props={{ maxWidth: 'xs' }}>
      {/* Helpful tips and tricks */}
      <Typography
        component="div"
        sx={{
          mb: 2,
        }}
      >
        This price is an estimate of the single best place to sell all your cargo. Since not every station buys
        everything it's possible that this price does not include some of your ores but this will always be shown with{' '}
        <Warning
          sx={{
            color: theme.palette.error.main,
            fontSize: '1.2rem',
          }}
        />
      </Typography>
      <Typography
        component="div"
        sx={{
          mb: 2,
        }}
      >
        All of our prices are synced hourly with UEX. UEX is a community-driven trading and commerce platform for Star
        Citizen.
      </Typography>
      <Typography
        component="div"
        sx={{
          mb: 2,
        }}
      >
        If you discover a price that is incorrect you can enroll as a UEX data runner and fix it
      </Typography>
      <Button
        fullWidth
        size="large"
        variant="outlined"
        href="https://uexcorp.space/"
        target="_blank"
        endIcon={<img src="https://static.uexcorp.space/img/logo.svg" alt="UEX Logo" width={40} height={40} />}
      >
        Visit
      </Button>
    </HelpModal>
  )
}
