import * as React from 'react'
import {
  Avatar,
  Badge,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Stack,
} from '@mui/material'
import { fontFamilies, theme } from '../../theme'
import { usesignals } from '../../hooks/useSignals'
import { yellow } from '@mui/material/colors'
import { AsteroidTypeEnum, DepositTypeEnum, getAsteroidTypeName, getDepositTypeName } from '@regolithco/common'
import { ClawIcon, GemIcon, RockIcon } from '../../icons'
import { Podcasts } from '@mui/icons-material'

export interface ScanModalProps {
  open: boolean
  onClose: () => void
}

export const ScanModal: React.FC<ScanModalProps> = ({ open, onClose }) => {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const [inputSignal, setSignal] = React.useState<number>(0)
  const possibilities = usesignals(inputSignal)

  const possibilityNodes = React.useMemo(() => {
    const retVal: React.ReactNode[] = []
    if (Object.keys(possibilities.asteroid).length > 0) {
      Object.entries(possibilities.asteroid).forEach(([key, value]) => {
        retVal.push(
          <Possitibility
            icon={<RockIcon />}
            name={`${getAsteroidTypeName(key as AsteroidTypeEnum)} Asteroid${value > 1 ? 's' : ''}`}
            value={value}
          />
        )
      })
    }
    if (Object.keys(possibilities.deposit).length > 0) {
      Object.entries(possibilities.deposit).forEach(([key, value]) => {
        retVal.push(
          <Possitibility
            icon={<RockIcon />}
            name={`${getDepositTypeName(key as DepositTypeEnum)} Surface Rock${value > 1 ? 's' : ''}`}
            value={value}
          />
        )
      })
    }
    if (possibilities.panels > 0) {
      retVal.push(
        <Possitibility
          icon={<ClawIcon />}
          name={`Salvage Panel${possibilities.panels > 1 ? 's' : ''}`}
          value={possibilities.panels}
        />
      )
    }

    if (possibilities.ROCGem > 0) {
      retVal.push(
        <Possitibility
          icon={<GemIcon />}
          name={`ROC Mineable Gem${possibilities.ROCGem > 1 ? 's' : ''}`}
          value={possibilities.ROCGem}
        />
      )
    }

    if (possibilities.handGem > 0) {
      retVal.push(
        <Possitibility
          icon={<GemIcon />}
          name={`Hand Mineable Gem${possibilities.handGem > 1 ? 's' : ''}`}
          value={possibilities.handGem}
        />
      )
    }

    return retVal
  }, [possibilities])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isSmall}
      sx={{
        '& .MuiDialog-paper': {
          [theme.breakpoints.up('md')]: {
            borderRadius: 10,
            boxShadow: `0px 0px 20px 5px ${theme.palette.primary.light}, 0px 0px 60px 40px black`,
            border: `10px solid ${theme.palette.primary.main}`,
          },
          background: theme.palette.background.default,
          // px: 4,
          // py: 2,
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(3px)',
          },
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
        <Stack direction={'row'} spacing={2} sx={{ mt: 2 }} alignItems={'center'}>
          <Podcasts />
          <Typography variant="h5">Scanning Calculator</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ minHeight: 200 }}>
        <Typography
          variant="overline"
          sx={{
            color: yellow[500],
          }}
        >
          Signal Strength:
        </Typography>
        <Stack direction={'row'} spacing={2} sx={{ mt: 2 }}>
          <TextField
            value={inputSignal || ''}
            autoFocus
            placeholder="TYPE SIGNAL"
            onFocus={(event) => {
              event.target.select()
            }}
            helperText="Enter the signal strength. Possible combinations will appear below."
            sx={{
              textAlign: 'center',
            }}
            InputLabelProps={{
              sx: {
                fontFamily: fontFamilies.robotoMono,
                color: yellow[500],
                textAlign: 'center',
                style: { textAlign: 'center' },
              },
            }}
            inputProps={{
              sx: {
                fontSize: 40,
                fontFamily: fontFamilies.robotoMono,
                fontWeight: 'bold',
                color: yellow[500],
                textAlign: 'center',
              },
            }}
            onChange={(e) => {
              if (e.target.value === '') {
                setSignal(0)
              }
              // If it's an integer then change it
              else if (Number.isInteger(parseInt(e.target.value))) {
                setSignal(parseInt(e.target.value))
              }
            }}
          />
        </Stack>
        <Stack
          sx={{
            '& *, & .MuiTypography-root': {
              fontFamily: fontFamilies.robotoMono,
              fontWeight: 'bold',
            },
          }}
        >
          {inputSignal > 0 && possibilityNodes.length === 0 && (
            <Stack spacing={1} sx={{ mt: 5 }}>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  width: '100%',
                  textAlign: 'center',
                }}
              >
                No matches for signal found.
              </Typography>
              <Typography
                variant="caption"
                component="div"
                sx={{
                  width: '100%',
                  textAlign: 'center',
                }}
              >
                (This could be a composite signal)
              </Typography>
            </Stack>
          )}
          {inputSignal > 0 && possibilityNodes.length > 0 && (
            <Typography
              variant="overline"
              component="div"
              sx={{
                mt: 4,
                borderBottom: `1px solid ${yellow[500]}`,
              }}
            >
              Possible Matches:
            </Typography>
          )}
          <List>{possibilityNodes}</List>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Box style={{ flexGrow: 1 }} />
        <Button color="primary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

interface PossitibilityProps {
  icon: React.ReactNode
  name: string
  value: number
}

const Possitibility: React.FC<PossitibilityProps> = ({ icon, name, value }) => {
  return (
    <ListItem alignItems="center">
      <ListItemAvatar
        sx={{
          mr: 3,
        }}
      >
        <Badge
          badgeContent={icon}
          variant="standard"
          sx={{
            '* svg': {
              backgroundColor: theme.palette.secondary.main,
              borderRadius: '50%',
              padding: 0.3,
              height: 30,
              width: 30,
              color: theme.palette.primary.contrastText,
            },
          }}
        >
          <Avatar sx={{ backgroundColor: theme.palette.primary.main, color: 'black' }}>{value}</Avatar>
        </Badge>
      </ListItemAvatar>
      <Typography sx={{ fontWeight: 'bold', fontSize: 30 }}>{name}</Typography>
    </ListItem>
  )
}
