import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import { Badge, SxProps, Theme, Tooltip, useTheme } from '@mui/material'
import { Engineering, Error, Person, Verified } from '@mui/icons-material'
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
  largeBadge: {
    '& svg': {
      height: 15,
      width: 15,
    },
  },
  smallBadge: {
    '& svg': {
      height: 15,
      width: 15,
    },
  },
  mediumBadge: {
    '& svg': {
      height: 18,
      width: 18,
    },
  },
})

export interface UserAvatarProps {
  user?: User | UserProfile
  error?: boolean
  sessionOwner?: boolean
  hideTooltip?: boolean
  size: 'small' | 'medium' | 'large'
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ size, user, error, sessionOwner, hideTooltip }) => {
  const myAvatar = makeAvatar(user?.avatarUrl as string)
  const theme = useTheme()
  const styles = stylesThunk(theme)

  const badgeStyle = {
    ...styles.allbadge,
    ...(styles[`${size}Badge`] || {}),
  }

  let tooltipText = user?.scName
  if (user?.state === UserStateEnum.Verified) {
    tooltipText += ' (Verified)'
  }
  if (sessionOwner) {
    tooltipText += ' (Session Owner)'
  }

  return (
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
        <Avatar
          alt={user?.scName}
          src={myAvatar}
          imgProps={{ referrerPolicy: 'no-referrer' }}
          color="secondary"
          sx={{
            background: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
            border: '1px solid',
          }}
        >
          {/* Fallbacks */}
          {error && !user ? <Error color="error" /> : <Person color="inherit" />}
        </Avatar>
      </Badge>
    </Badge>
  )
}
