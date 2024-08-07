import { ExpandCircleDown, ExpandCircleDownOutlined } from '@mui/icons-material';
import { Alert, AlertTitle, Button, Link, Stack } from '@mui/material';
import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import { RegolithAlert } from '../types'

interface HomePageAlertProps {
  alert: RegolithAlert
}

export const HomePageAlert: React.FC<HomePageAlertProps> = ({ alert }) => {
  const [expanded, setExpanded] = React.useState(false)
  const nowDate = new Date()

  if (alert.endDate && new Date(alert.endDate) < nowDate) return null

  return (
    <Alert
      severity={alert.severity || 'info'}
      onClick={() => setExpanded(!expanded)}
      sx={{
        cursor: 'pointer',
        '.MuiAlert-message': {
          width: '100%',
        },
      }}
    >
      {alert.title && (
        <Stack direction="row" flex={1} alignItems="center" justifyContent="space-between">
          <AlertTitle>{alert.title}</AlertTitle>
          <Button
            size="small"
            endIcon={expanded ? <ExpandCircleDownOutlined /> : <ExpandCircleDown />}
            color="inherit"
            sx={{
              opacity: expanded ? 0.2 : 1,
            }}
            onClick={(e) => {
              e.stopPropagation()
              setExpanded(!expanded)
            }}
          >
            More
          </Button>
        </Stack>
      )}
      {expanded && (
        <ReactMarkdown
          components={{
            a: ({ node, ref, ...props }) => <Link {...props} target="_blank" />,
          }}
        >
          {alert.message}
        </ReactMarkdown>
      )}
    </Alert>
  )
}
