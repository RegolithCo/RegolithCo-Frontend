import { BorderAll, CloudDownload, DataObject } from '@mui/icons-material'
import { Avatar, Box, Button, Modal, Stack, Typography, useTheme } from '@mui/material'
import * as React from 'react'

export type DownloadModalProps = {
  open?: boolean
  title: string
  description: string
  downloadCSV?: () => void
  downloadJSON?: () => void
  onClose: () => void
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  open,
  title,
  description,
  downloadCSV,
  downloadJSON,
  onClose,
}) => {
  const theme = useTheme()

  return (
    <Modal open={Boolean(open)} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute' as const,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 10,
          border: `10px solid ${theme.palette.primary.dark}`,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Avatar sx={{ background: theme.palette.primary.dark }}>
            <CloudDownload color="inherit" />
          </Avatar>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
        </Stack>
        <Typography id="modal-modal-title" variant="body1" component="div" paragraph>
          {description}
        </Typography>
        {downloadCSV && (
          <Button
            variant="contained"
            startIcon={<BorderAll />}
            sx={{
              my: 2,
            }}
            onClick={() => {
              onClose()
              downloadCSV()
            }}
            size="large"
            fullWidth
          >
            CSV
          </Button>
        )}
        {downloadJSON && (
          <Button
            variant="contained"
            startIcon={<DataObject />}
            sx={{
              my: 2,
            }}
            onClick={() => {
              onClose()
              downloadJSON()
            }}
            size="large"
            fullWidth
          >
            JSON
          </Button>
        )}
      </Box>
    </Modal>
  )
}
