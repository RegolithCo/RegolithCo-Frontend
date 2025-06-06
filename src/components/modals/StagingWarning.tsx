import * as React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, useTheme, Link } from '@mui/material'
import { BugReport, Cake, Warning } from '@mui/icons-material'
import { fontFamilies } from '../../theme'
import useLocalStorage from '../../hooks/useLocalStorage'

const STAGE = document.querySelector<HTMLMetaElement>('meta[name=stage]')?.content
const IS_STAGING = STAGE === 'dev' || STAGE === '%STAGE%' || STAGE === 'staging'

export const StagingWarning: React.FC = () => {
  const theme = useTheme()
  const [lastDismissTestWarning, setDismissTestWarning] = useLocalStorage<number>('DISMISS_TEST_WARNING', 0)

  if (!IS_STAGING) return null
  if (lastDismissTestWarning > new Date().getTime() - 1000 * 60 * 60) return null // 1 hour
  return (
    <Dialog
      open
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 10,
          boxShadow: `0px 0px 20px 5px ${theme.palette.error.light}, 0px 0px 60px 40px black`,
          background: theme.palette.background.default,
          border: `10px solid ${theme.palette.error.main}`,
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
          backgroundColor: theme.palette.error.main,
          color: theme.palette.error.contrastText,
          textAlign: 'center',
          mb: 2,
        }}
      >
        <Warning />
        THIS IS A TEST SERVER!!!
      </DialogTitle>
      <DialogContent>
        <Typography component="p" gutterBottom>
          You are currently looking at a <strong style={{ color: theme.palette.error.light }}>TEST</strong> server for
          <strong style={{ color: theme.palette.error.light }}>TESTING</strong> Regolith. Please be aware that any{' '}
          <strong style={{ color: theme.palette.error.light }}>TEST</strong>
          data you enter for <strong style={{ color: theme.palette.error.light }}>TESTING</strong> may (and probably
          will) be lost at any time because of all the{' '}
          <strong style={{ color: theme.palette.error.light }}>TESTING</strong>
        </Typography>
        <Typography gutterBottom variant="caption">
          ...also the <Cake sx={{ fontSize: '1em' }} /> is a lie.
        </Typography>
        <Typography component="p" gutterBottom>
          If you are looking for the live version of Regolith please visit:{' '}
        </Typography>
        <Typography gutterBottom variant="h6" align="center">
          <Link href="https://regolith.rocks">https://regolith.rocks</Link>
        </Typography>
      </DialogContent>
      <DialogActions>
        <div style={{ flexGrow: 1 }} />
        <Button
          color="error"
          // size="large"
          variant="contained"
          onClick={() => {
            setDismissTestWarning(new Date().getTime())
          }}
          startIcon={<BugReport />}
          // endIcon={<BugReport />}
        >
          I Understand
        </Button>
        <div style={{ flexGrow: 1 }} />
      </DialogActions>
    </Dialog>
  )
}
