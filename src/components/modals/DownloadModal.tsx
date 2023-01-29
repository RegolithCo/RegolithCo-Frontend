import { BorderAll, CloudDownload, DataObject } from '@mui/icons-material'
import { Avatar, Box, Button, Modal, Stack, Typography, useTheme } from '@mui/material'
import { JSONObject } from '@regolithco/common'
import * as React from 'react'

export type DownloadModalProps = {
  open?: boolean
  title: string
  description: string
  fileName?: string
  csvData?: string[][]
  jsonData?: JSONObject
  onClose: () => void
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  open,
  title,
  description,
  fileName,
  csvData,
  jsonData,
  onClose,
}) => {
  const theme = useTheme()

  const downloadFile = (data: string, finalFileName: string, fileType: string) => {
    // Create a blob with the data we want to download as a file
    const blob = new Blob([data], { type: fileType })
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement('a')
    a.download = finalFileName
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
  }

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
        {csvData && (
          <Button
            variant="contained"
            startIcon={<BorderAll />}
            sx={{
              my: 2,
            }}
            onClick={() => {
              onClose()
              downloadFile(csvData.toString(), `${fileName}.csv`, 'text/csv')
            }}
            size="large"
            fullWidth
          >
            CSV
          </Button>
        )}
        {jsonData && (
          <Button
            variant="contained"
            startIcon={<DataObject />}
            sx={{
              my: 2,
            }}
            onClick={() => {
              onClose()
              downloadFile(JSON.stringify(jsonData, null, 2), `${fileName}.csv`, 'text/csv')
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
