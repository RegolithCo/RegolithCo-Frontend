import { Close, Engineering } from '@mui/icons-material'
import { Box, Button, ButtonGroup, Dialog, IconButton, Typography, useTheme } from '@mui/material'
import { AuthTypeEnum } from '@regolithco/common'
import * as React from 'react'
import { RockIcon } from '../../icons'
import log from 'loglevel'

export type PasteDetectedModalProps = {
  open: boolean
  onClose: () => void
  onNewWorkOrderFromPaste: () => void
  onNewRockClusterFromPaste: () => void
}

export const PasteDetectedModal: React.FC<PasteDetectedModalProps> = ({
  open,
  onClose,
  onNewWorkOrderFromPaste,
  onNewRockClusterFromPaste,
}) => {
  const theme = useTheme()
  return (
    <Dialog
      open={Boolean(open)}
      maxWidth="sm"
      fullWidth
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 10,
          boxShadow: 24,
          p: 4,
          border: `10px solid ${theme.palette.primary.main}`,
          background: theme.palette.background.paper,
        },
      }}
    >
      <Box>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
          }}
        >
          <Close />
        </IconButton>
        <Typography id="modal-modal-title" variant="h6" component="h2" paragraph>
          Pasted Image Detected:
        </Typography>
        <Typography id="modal-modal-title" variant="body1" component="div" paragraph>
          What kind of item would you like to create?:
        </Typography>
        <ButtonGroup
          // orientation="vertical"
          color="primary"
          variant="outlined"
          fullWidth
          size="large"
          sx={{
            my: 4,
            '& svg': {
              mr: 1,
            },
          }}
        >
          <Button
            value={AuthTypeEnum.Discord}
            color="primary"
            onClick={onNewWorkOrderFromPaste}
            startIcon={<Engineering />}
          >
            New Work Order
          </Button>
          <Button
            value={AuthTypeEnum.Google}
            color="secondary"
            onClick={onNewRockClusterFromPaste}
            startIcon={<RockIcon />}
          >
            New Rock cluster
          </Button>
        </ButtonGroup>
      </Box>
    </Dialog>
  )
}
