import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { yellow } from '@mui/material/colors'
import { Badge, CircularProgress, SxProps, Theme, useTheme } from '@mui/material'
import { fontFamilies } from '../theme'
import { Error, Login, Person, Verified } from '@mui/icons-material'
import { makeAvatar, UserStateEnum } from '@regolithco/common'
// import { LoginExpiryTimer } from './fields/LoginExpiryTimer'
import { RockIcon } from '../icons'
import { LoginContextObj } from '../hooks/useOAuth2'

const pages = {
  '/session': 'Sessions',
  '/cluster': 'Cluster Calc.',
  '/workorder': 'Work Order',
  '/tables': 'Data Tables',
  '/about': 'About',
  // '/faq': 'FAQ',
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  appBar: {
    fontFamily: fontFamilies.robotoMono,
    bgcolor: yellow[700],
    color: '#000',
    px: 2,
    [theme.breakpoints.down('sm')]: {
      px: 0,
      mx: 0,
    },
  },
  siteIcon: {
    display: { md: 'flex', cursor: 'pointer' },
    mr: 1,
  },
  siteName: {
    mr: 2,
    cursor: 'pointer',
    fontFamily: fontFamilies.robotoMono,
    fontWeight: 700,
    letterSpacing: '.3rem',
    fontSize: '1.25rem',
    [theme.breakpoints.down('sm')]: {
      letterSpacing: '.1rem',
      fontSize: '1rem',
      mr: 0.2,
    },
    color: 'inherit',
    textDecoration: 'none',
  },
  toolbar: {},
})

export interface TopBarProps {
  userCtx: LoginContextObj
  navigate?: (path: string) => void
}

export const TopBar: React.FC<TopBarProps> = ({ userCtx, navigate }) => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)
  const myAvatar = makeAvatar(userCtx.userProfile?.avatarUrl as string)
  const theme = useTheme()
  const styles = stylesThunk(theme)
  // const [shareOpen, setShareOpen] = React.useState(false)

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleNavigate = (path: string) => {
    setAnchorElNav(null)
    setAnchorElUser(null)
    if (navigate) {
      navigate(path)
    }
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <AppBar position="static" sx={styles.appBar}>
      {userCtx.popup}
      {userCtx.refreshPopup}
      <Toolbar disableGutters sx={styles.toolbar}>
        <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
              color: 'inherit',
            }}
          >
            {Object.entries(pages).map(([path, name]) => (
              <MenuItem key={path} onClick={() => handleNavigate(path)}>
                <Typography textAlign="center">{name}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
        {/* This is our mini menu for mobile */}
        <RockIcon sx={styles.siteIcon} />
        <Typography variant="h5" noWrap component="a" onClick={() => handleNavigate('/')} sx={styles.siteName}>
          Regolith Co.
        </Typography>

        {/* This is the login Menu for non-mobile */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {Object.entries(pages).map(([path, name]) => (
            <Button key={path} onClick={() => handleNavigate(path)} sx={{ my: 2, color: 'inherit', display: 'block' }}>
              {name}
            </Button>
          ))}
        </Box>

        {/* Debugger for oauth token expiry */}
        {/* <Box sx={{ flexGrow: 0 }}>{userCtx.isAuthenticated && <LoginExpiryTimer />}</Box> */}

        {/* Profile icon, username and badge */}
        <div style={{ flexGrow: 1 }} />
        <Box sx={{ flexGrow: 0 }}>
          {userCtx.isAuthenticated && (
            <>
              {userCtx.loading ? (
                <CircularProgress color="secondary" thickness={7} />
              ) : (
                <Button
                  onClick={handleOpenUserMenu}
                  sx={{
                    fontFamily: fontFamilies.robotoMono,
                    fontWeight: 'bold',
                    color: theme.palette.primary.contrastText,
                  }}
                  endIcon={
                    <Badge
                      badgeContent={
                        userCtx.userProfile?.state === UserStateEnum.Verified ? <Verified color="success" /> : null
                      }
                      sx={
                        userCtx.userProfile?.state === UserStateEnum.Verified
                          ? {
                              '& svg': {
                                strokeWidth: '0.5px',
                                stroke: 'black',
                              },
                              '& .MuiBadge-badge::before': {
                                content: '" "',
                                display: 'block',
                                background: 'black',
                                position: 'absolute',

                                height: '16px',
                                width: '16px',
                                zIndex: -1,
                                borderRadius: '50%',
                              },
                            }
                          : {}
                      }
                      overlap="circular"
                    >
                      <Avatar
                        alt={userCtx.userProfile?.scName}
                        src={myAvatar}
                        imgProps={{ referrerPolicy: 'no-referrer' }}
                        color="secondary"
                        sx={{
                          background: theme.palette.secondary.main,
                          color: theme.palette.secondary.contrastText,
                          border: '1px solid',
                        }}
                      >
                        {userCtx.error && !userCtx.userProfile ? <Error color="error" /> : <Person color="inherit" />}
                      </Avatar>
                    </Badge>
                  }
                >
                  {userCtx.userProfile?.scName}
                </Button>
              )}
              <Menu
                sx={{ mt: '45px', color: 'inherit' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {userCtx.isInitialized && (
                  <MenuItem onClick={() => handleNavigate('/profile')} sx={{ color: 'inherit' }}>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                )}
                {userCtx.isInitialized && !userCtx.isVerified && (
                  <MenuItem onClick={() => handleNavigate('/verify')}>
                    <Typography textAlign="center">Verify Account</Typography>
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    userCtx.logOut()
                    handleNavigate('/')
                  }}
                >
                  <Typography textAlign="center">Signout</Typography>
                </MenuItem>
              </Menu>
            </>
          )}
          {!userCtx.isAuthenticated && (
            <Button color="inherit" onClick={() => userCtx.openPopup()} startIcon={<Login />}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
