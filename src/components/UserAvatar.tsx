import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import { Badge, SxProps, Theme, Tooltip, useTheme } from '@mui/material'
import { Engineering, Error, PeopleAlt, Person, Verified } from '@mui/icons-material'
import { makeAvatar, User, UserProfile, UserStateEnum } from '@regolithco/common'

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
    '& svg': {
      height: 30,
      width: 30,
    },
  },
  largeAvatar: {},
  largeBadge: {
    '& svg': {
      height: 15,
      width: 15,
    },
  },
  smallAvatar: {},
  smallBadge: {
    '& svg': {
      height: 15,
      width: 15,
    },
  },

  mediumAvatar: {},
  mediumBadge: {
    '& svg': {
      height: 18,
      width: 18,
    },
  },
})

export interface UserAvatarProps {
  user?: User | UserProfile
  isFriend?: boolean
  error?: boolean
  sessionOwner?: boolean
  hideTooltip?: boolean
  size: 'small' | 'medium' | 'large' | 'xlarge'
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ size, user, error, sessionOwner, isFriend, hideTooltip }) => {
  const myAvatar = makeAvatar(user?.avatarUrl as string)
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

  const tooltipText: string[] = [user?.scName as string]
  tooltipText.push(user?.state === UserStateEnum.Verified ? 'Verified User' : 'Unverified User')
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
              alt={user?.scName}
              src={myAvatar}
              imgProps={{ referrerPolicy: 'no-referrer' }}
              color="secondary"
              sx={{
                ...avatarStyle,
                background: theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
                border: '1px solid',
              }}
            >
              {/* Fallbacks */}
              {error && !user ? <Error color="error" /> : <Person color="inherit" />}
            </Avatar>
          </Tooltip>
        </Badge>
      </Badge>
    </Badge>
  )
}
