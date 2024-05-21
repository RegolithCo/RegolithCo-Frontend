import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import { Badge, SxProps, Theme, Tooltip, useTheme } from '@mui/material'
import { Engineering, Error, PeopleAlt, Verified } from '@mui/icons-material'
import { PendingUser, makeAvatar, User, UserProfile, UserStateEnum } from '@regolithco/common'

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  allbadge: {
    '& svg': {
      strokeWidth: '0.5px',
      stroke: 'black',
    },
    '& .MuiBadge-badge::before': {
      content: '" "',
      display: 'block',
      background: 'black',
      position: 'absolute',
      height: '12px',
      width: '12px',
      zIndex: -1,
      borderRadius: '50%',
    },
  },
  allAvatar: {},
  xlargeAvatar: {
    height: 90,
    width: 90,
  },
  xlargeBadge: {
    '& .MuiBadge-badge svg': {
      height: 30,
      width: 30,
    },
  },
  largeAvatar: {},
  largeBadge: {
    '& .MuiBadge-badge svg': {
      height: 15,
      width: 15,
    },
  },
  smallAvatar: {
    height: 30,
    width: 30,
  },
  smallBadge: {
    '& .MuiBadge-badge svg': {
      height: 15,
      width: 15,
    },
  },
  tinyAvatar: {
    height: 20,
    width: 20,
  },
  tinyBadge: {
    '& .MuiBadge-badge svg': {
      height: 15,
      width: 15,
    },
  },

  mediumAvatar: {},
  mediumBadge: {
    '& .MuiBadge-badge svg': {
      height: 18,
      width: 18,
    },
  },
})

export interface UserAvatarProps {
  user?: User | UserProfile
  pendingUser?: PendingUser
  isFriend?: boolean
  error?: boolean
  privacy?: boolean
  sessionOwner?: boolean
  hideTooltip?: boolean
  size: 'tiny' | 'small' | 'medium' | 'large' | 'xlarge'
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  size,
  user,
  pendingUser,
  privacy,
  error,
  sessionOwner,
  isFriend,
  hideTooltip,
}) => {
  const myAvatar = user
    ? makeAvatar(user?.avatarUrl as string)
    : `${import.meta.env.BASE_URL}/images/avatars/PendingUser.jpg`
  const isInnactive = !user && pendingUser
  const theme = useTheme()
  const styles = stylesThunk(theme)
  const badgeStyle = {
    ...styles.allbadge,
    ...(styles[`${size}Badge`] || {}),
  }

  const avatarStyle = {
    ...styles.allAvatar,
    ...(styles[`${size}Avatar`] || {}),
  }

  const scName = privacy ? 'USER' : user?.scName || pendingUser?.scName || 'USER'
  const tooltipText: string[] = [scName]
  if (user) tooltipText.push(user?.state === UserStateEnum.Verified ? 'Verified User' : 'Unverified User')
  else tooltipText.push('Pending User')
  if (sessionOwner) {
    tooltipText.push('Session Owner')
  }
  if (isFriend) {
    tooltipText.push('Friend')
  }

  return (
    <Badge
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      badgeContent={isFriend ? <PeopleAlt color="info" /> : null}
      sx={isFriend ? badgeStyle : {}}
      overlap="circular"
    >
      <Badge
        badgeContent={user?.state === UserStateEnum.Verified ? <Verified color="success" /> : null}
        sx={user?.state === UserStateEnum.Verified ? badgeStyle : {}}
        overlap="circular"
      >
        <Badge
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          badgeContent={sessionOwner ? <Engineering color="secondary" /> : null}
          sx={sessionOwner ? badgeStyle : {}}
          overlap="circular"
        >
          <Tooltip title={hideTooltip ? '' : tooltipText.join(' - ')} placement="bottom" arrow>
            <Avatar
              alt={scName}
              src={!privacy ? myAvatar : undefined}
              imgProps={{ referrerPolicy: 'no-referrer' }}
              color="secondary"
              sx={{
                ...avatarStyle,
                border: isInnactive ? '3px solid #193671' : '1px solid',
                background: theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
              }}
            >
              {/* Fallbacks */}
              {error && !user ? (
                <Error color="error" />
              ) : (
                <img
                  src={`${import.meta.env.BASE_URL}/images/avatars/NoAvatar.jpg`}
                  style={{
                    height: '100%',
                    width: '100%',
                  }}
                />
              )}
            </Avatar>
          </Tooltip>
        </Badge>
      </Badge>
    </Badge>
  )
}
