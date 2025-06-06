import * as React from 'react'

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
  useTheme,
  Stack,
} from '@mui/material'
import { Cancel, GroupAdd, Percent, PieChart, QuestionMark, Toll } from '@mui/icons-material'
import { SessionRoleEnum, ShareTypeEnum, ShipRoleEnum, UserSuggest } from '@regolithco/common'
import {
  SessionRoleColors,
  SessionRoleIcons,
  SessionRoleNames,
  ShipRoleColors,
  ShipRoleIcons,
  ShipRoleNames,
} from '../../lib/roles'
import { ShipRoleIconBadge } from '../fields/ShipRoleChooser'
import { SessionRoleIconBadge } from '../fields/SessionRoleChooser'
import { AppContext } from '../../context/app.context'
import log from 'loglevel'
import { fontFamilies } from '../../theme'
import { MValue, MValueFormat } from '../fields/MValue'

export interface RoleCrewShareAddModalProps {
  open: boolean
  role: SessionRoleEnum | ShipRoleEnum
  onClose: () => void
  onConfirm: ({ scNames, shareType, share }: { scNames: string[]; shareType: ShareTypeEnum; share: number }) => void
  userSuggest?: UserSuggest
  confirmBtnText?: string
  cancelBtnText?: string
  confirmIcon?: React.ReactNode
  cancelIcon?: React.ReactNode
}

const DEFAULTS = {
  [ShareTypeEnum.Share]: 1,
  [ShareTypeEnum.Amount]: 10000,
  [ShareTypeEnum.Percent]: 10,
}

export const RoleCrewShareAddModal: React.FC<RoleCrewShareAddModalProps> = ({
  open,
  role,
  onClose,
  onConfirm,
  userSuggest,
  confirmBtnText,
  cancelBtnText,
  confirmIcon,
  cancelIcon,
}) => {
  const [shareType, setShareType] = React.useState<ShareTypeEnum>(ShareTypeEnum.Percent)
  const [shareTxt, setShareTxt] = React.useState(DEFAULTS)
  const [share, setShare] = React.useState(DEFAULTS)
  const [isSplit, setIsSplit] = React.useState<boolean>(true)
  const [valError, setValError] = React.useState<boolean>(false)
  const { getSafeName } = React.useContext(AppContext)
  const isFound =
    Object.values(SessionRoleEnum).includes(role as SessionRoleEnum) ||
    Object.values(ShipRoleEnum).includes(role as ShipRoleEnum)
  const isShipRole = Object.values(ShipRoleEnum).includes(role as ShipRoleEnum)

  const roleName = isFound
    ? isShipRole
      ? ShipRoleNames[role as ShipRoleEnum]
      : SessionRoleNames[role as SessionRoleEnum]
    : role
  const Icon = isFound
    ? isShipRole
      ? ShipRoleIcons[role as ShipRoleEnum]
      : SessionRoleIcons[role as SessionRoleEnum]
    : QuestionMark
  const color = isFound ? (isShipRole ? ShipRoleColors[role] : SessionRoleColors[role]) : '#555555'

  const affectedUsers = React.useMemo(() => {
    if (!userSuggest) return []
    return Object.keys(userSuggest).filter((scName) => {
      const user = userSuggest[scName]
      return user.shipRole === role || user.sessionRole === role
    })
  }, [userSuggest, role])

  const theme = useTheme()
  const finalShare = React.useMemo(() => {
    let base = share[shareType]
    if (shareType === ShareTypeEnum.Percent) {
      base = base / 100
    }
    if (isSplit) {
      return base / affectedUsers.length
    }
    return base
  }, [share, shareType, isSplit, affectedUsers])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 10,
          boxShadow: `0px 0px 20px 5px ${theme.palette.primary.light}, 0px 0px 60px 40px black`,
          background: theme.palette.background.default,
          border: `10px solid ${theme.palette.primary.main}`,
          px: 4,
          py: 2,
        },
      }}
    >
      <DialogTitle>Add shares for all users with {isShipRole ? 'ship' : 'session'} role:</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={1} alignItems="center" width={'100%'} justifyContent={'center'}>
          <Box
            sx={{
              ml: 1,
              color,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              p: 2,
              borderRadius: 5,
              border: `1px solid ${color}`,
            }}
          >
            <Icon sx={{ color, mr: 1 }} />
            <Typography variant="h6">{roleName}</Typography>
          </Box>
        </Stack>
        <Typography
          variant="subtitle2"
          color="primary"
          sx={{
            mt: 2,
            mb: 1,
            borderBottom: `1px solid ${theme.palette.primary.main}`,
          }}
        >
          Share Details
        </Typography>
        <Stack spacing={2} sx={{ mt: 2 }} direction={{ xs: 'column', sm: 'row' }}>
          <TextField
            autoFocus
            defaultValue={DEFAULTS[shareType]}
            error={valError}
            value={shareTxt[shareType]}
            onFocus={(event) => {
              event.target.select()
            }}
            onChange={(e) => {
              let newTargetVal = e.target.value
              setShareTxt({ ...shareTxt, [shareType]: newTargetVal })
              if (e.target.value.trim() === '') {
                newTargetVal = '0'
              }
              try {
                let tValParsed = parseFloat(newTargetVal)
                // Round to 2 decimal places
                tValParsed = Math.round(tValParsed * 100) / 100
                if (shareType === ShareTypeEnum.Amount) {
                  // Verify that the value is >0 and an integer
                  if (tValParsed >= 0 && Number.isInteger(tValParsed)) {
                    if (valError) setValError(false)
                    setShare({ ...share, [shareType]: tValParsed })
                  } else {
                    setValError(true)
                  }
                } else if (shareType === ShareTypeEnum.Percent) {
                  if (tValParsed >= 0 && tValParsed <= 100) {
                    if (valError) setValError(false)
                    setShare({ ...share, [shareType]: tValParsed })
                  } else {
                    setValError(true)
                  }
                } else if (shareType === ShareTypeEnum.Share) {
                  if (tValParsed >= 0) {
                    if (valError) setValError(false)
                    setShare({ ...share, [shareType]: tValParsed })
                  } else {
                    setValError(true)
                  }
                }
              } catch (e) {
                setValError(true)
                log.error(e)
              }
            }}
            onKeyDown={(event) => {
              // handle any punctuation keys like *().,;'"" but allow escape keys like enter
              if (event.key.length === 1 && !event.key.match(/[0-9.]/)) {
                event.preventDefault()
              }
            }}
            inputProps={{
              sx: {
                textAlign: 'right',
                fontFamily: fontFamilies.robotoMono,
              },
            }}
          />
          <Select
            variant="outlined"
            sx={{
              '& .MuiInputBase-input': {
                py: 2,
              },
            }}
            value={shareType}
            renderValue={(value) => {
              let Icon = PieChart
              switch (value) {
                case ShareTypeEnum.Share:
                  Icon = PieChart
                  break
                case ShareTypeEnum.Amount:
                  Icon = Toll
                  break
                case ShareTypeEnum.Percent:
                  Icon = Percent
                  break
              }
              return (
                <Typography
                  sx={{
                    // Align contents vertically
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Icon
                    sx={{
                      mr: 2,
                    }}
                  />{' '}
                  {value}
                </Typography>
              )
            }}
            onChange={(event: SelectChangeEvent) => {
              setShareType(event.target.value as ShareTypeEnum)
            }}
          >
            <Typography
              variant="overline"
              component="div"
              sx={{
                px: 2,
                fontWeight: 'bold',
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              }}
            >
              Share Type
            </Typography>
            <MenuItem value={ShareTypeEnum.Share}>
              <PieChart sx={{ my: 0, mr: 2 }} /> Equal Share
            </MenuItem>
            <MenuItem value={ShareTypeEnum.Amount}>
              <Toll sx={{ my: 0, mr: 2 }} /> Flat Rate (aUEC)
            </MenuItem>
            <MenuItem value={ShareTypeEnum.Percent}>
              <Percent sx={{ my: 0, mr: 2 }} /> Percentage
            </MenuItem>
          </Select>

          {/* Whether we're doing "each" or an even split */}
          <FormControlLabel
            control={<Switch checked={isSplit} onChange={(event) => setIsSplit(event.target.checked)} />}
            label="Split"
          />
        </Stack>
        <Typography
          variant="subtitle2"
          color="primary"
          sx={{
            mt: 2,
            mb: 1,
            borderBottom: `1px solid ${theme.palette.primary.main}`,
          }}
        >
          Preview
        </Typography>
        {affectedUsers.length === 0 && (
          <Typography variant="body1" color="error" fontStyle={'italic'}>
            No users found with this role.
          </Typography>
        )}
        <Table size="small">
          <TableBody>
            {affectedUsers.map((userScName, idx) => {
              const userWithRoles = userSuggest && userSuggest[userScName]
              return (
                <TableRow>
                  <TableCell>{getSafeName(userScName)}</TableCell>
                  <TableCell padding="none">
                    <ShipRoleIconBadge
                      key="sessionRole"
                      role={userWithRoles?.shipRole as ShipRoleEnum}
                      sx={{
                        fontSize: '1rem',
                      }}
                    />
                  </TableCell>
                  <TableCell padding="none">
                    <SessionRoleIconBadge
                      key="sessionRole"
                      role={userWithRoles?.sessionRole as SessionRoleEnum}
                      sx={{
                        fontSize: '1rem',
                      }}
                    />
                  </TableCell>
                  <TableCell
                    padding="none"
                    align="right"
                    width={'30%'}
                    sx={{
                      color: theme.palette.primary.light,
                    }}
                  >
                    {shareType === ShareTypeEnum.Share && (
                      <>
                        <MValue value={finalShare} format={MValueFormat.number} maxDecimals={2} /> Shares
                      </>
                    )}
                    {shareType === ShareTypeEnum.Amount && <MValue value={finalShare} format={MValueFormat.currency} />}
                    {shareType === ShareTypeEnum.Percent && (
                      <MValue value={finalShare} format={MValueFormat.percent} maxDecimals={2} />
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <Alert severity="warning" sx={{ mt: 2 }} variant="outlined">
          Note: This will overwrite any existing shares for the users above.
        </Alert>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
          <Button
            color="primary"
            variant="outlined"
            onClick={onClose}
            startIcon={cancelIcon || <Cancel />}
            sx={{ background: theme.palette.background.paper }}
          >
            {cancelBtnText || 'Cancel'}
          </Button>
          <div style={{ flexGrow: 1 }} />
          <Button
            color="secondary"
            variant="contained"
            disabled={valError || affectedUsers.length === 0 || finalShare === 0}
            startIcon={confirmIcon || <GroupAdd />}
            onClick={() => {
              onConfirm({
                scNames: affectedUsers,
                shareType,
                share: finalShare,
              })
              onClose()
            }}
          >
            {'Add Shares'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
