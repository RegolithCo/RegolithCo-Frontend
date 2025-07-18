import { BorderAll, CloudDownload, DataObject } from '@mui/icons-material'
import { Avatar, Box, Button, Modal, Stack, Typography, useTheme } from '@mui/material'
import * as React from 'react'
import { MUIRouterLink } from '../RouterLink'

export type DownloadModalProps = {
  open?: boolean
  downloadWorkOrderCSV?: () => void
  downloadCrewShareCSV?: () => void
  downloadMembersCSV?: () => void
  downloadJSON?: () => void
  onClose: () => void
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  open,
  downloadWorkOrderCSV,
  downloadCrewShareCSV,
  downloadMembersCSV,
  downloadJSON,
  onClose,
}) => {
  const theme = useTheme()
  // const navigate = useNavigate()

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
          boxShadow: `0px 0px 20px 5px ${theme.palette.primary.light}, 0px 0px 60px 40px black`,
          border: `10px solid ${theme.palette.primary.main}`,
          p: 4,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Avatar sx={{ background: theme.palette.primary.main }}>
            <CloudDownload color="inherit" />
          </Avatar>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Download Session
          </Typography>
        </Stack>
        <Typography id="modal-modal-title" variant="body1" component="div" gutterBottom>
          Download the session data as a JSON file.
        </Typography>
        <Typography variant="overline" component="div">
          JSON
        </Typography>
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
            Download JSON
          </Button>
        )}
        <Typography variant="overline" component="div">
          CSV
        </Typography>
        <Typography variant="caption" component="div" fontStyle={'italic'} color="text.secondary">
          NOTE: CSV files are really finicky to create and these are DEFINITELY not perfect. They need to be re-done but
          for now they are here for your use. We recommend strongly that you use the API or the JSON download for any
          computational scripts or third-party development.
        </Typography>

        {downloadWorkOrderCSV && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<BorderAll />}
            sx={{
              my: 2,
            }}
            onClick={() => {
              onClose()
              downloadWorkOrderCSV()
            }}
            size="large"
            fullWidth
          >
            Work Orders CSV
          </Button>
        )}
        {downloadCrewShareCSV && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<BorderAll />}
            sx={{
              my: 2,
            }}
            onClick={() => {
              onClose()
              downloadCrewShareCSV()
            }}
            size="large"
            fullWidth
          >
            Crew Shares CSV
          </Button>
        )}
        {downloadMembersCSV && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<BorderAll />}
            sx={{
              my: 2,
            }}
            onClick={() => {
              onClose()
              downloadMembersCSV()
            }}
            size="large"
            fullWidth
          >
            Session Members CSV
          </Button>
        )}

        <Typography variant="caption" component="div" gutterBottom>
          Regolith is now <MUIRouterLink localUrl="/profile/api">API enabled</MUIRouterLink>. If you'd rather fetch data
          programmatically, you can use the API to get the data you need.
        </Typography>
      </Box>
    </Modal>
  )
}
