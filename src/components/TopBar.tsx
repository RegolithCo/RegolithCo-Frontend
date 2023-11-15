import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Button from '@mui/material/Button'
import { yellow } from '@mui/material/colors'
import { CircularProgress, SxProps, Theme, useTheme } from '@mui/material'
import { fontFamilies } from '../theme'
import {
  Calculate,
  CalendarMonth,
  Celebration,
  Coffee,
  Engineering,
  HelpCenter,
  Info,
  Login,
  Logout,
  NewReleases,
  Person,
  QuestionAnswer,
  Store,
  Storefront,
  TableChart,
  Verified,
} from '@mui/icons-material'
import { RockIcon } from '../icons'
import { LoginContextObj } from '../hooks/useOAuth2'
import { UserAvatar } from './UserAvatar'
import { ModuleIcon } from '../icons/Module'
import { TopBarMenu, TopBarMenuItem } from './TopBarMenu'
import { LaserIcon } from '../icons/Laser'

export type MenuItemType = {
  path?: string
  isDivider?: boolean
  action?: () => void
  disabled?: boolean
  show?: boolean
  name?: string
  icon?: React.ReactNode
  children?: MenuItemType[]
}

const STAGE = document.querySelector<HTMLMetaElement>('meta[name=stage]')?.content
const IS_STAGING = !STAGE || STAGE === 'dev' || STAGE === 'staging'

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
    zIndex: (theme) => theme.zIndex.drawer + 1,
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
  const [openMenu, setMenuOpen] = React.useState<null | { name: string; el: HTMLElement }>(null)
  const theme = useTheme()
  const styles = stylesThunk(theme)
  // const [shareOpen, setShareOpen] = React.useState(false)

  const handleOpenMenu = (name: string) => (event: React.MouseEvent<HTMLElement>) => {
    setMenuOpen({ name: name, el: event.currentTarget })
  }

  const handleNavigate = (path?: string, action?: () => void) => {
    setMenuOpen(null)
    // take the action (if any)
    if (action) action()
    // navigate to the path (if any)
    if (path && navigate) navigate(path)
  }

  const handleCloseMenu = () => {
    setMenuOpen(null)
  }

  const topBarMenu: MenuItemType[] = [
    //
    { path: '/session', name: 'Mining Sessions', icon: <CalendarMonth /> },
    {
      name: 'Calculators',
      icon: <Calculate />,
      children: [
        { path: '/workorder', name: 'Work Order', icon: <Engineering /> },
        { path: '/cluster', name: 'Rock / Cluster Calculator', icon: <RockIcon /> },
        { path: '/loadouts', name: 'Ship Loadouts', icon: <ModuleIcon /> },
        { path: '/marketPrice', name: 'Market Price Calculator', icon: <Storefront /> },
      ],
    },
    {
      path: '/tables/ore',
      name: 'Data Tables',
      icon: <TableChart />,
      children: [
        { path: '/tables/ore', name: 'Refinery Methods', icon: <TableChart /> },
        { path: '/tables/refinery', name: 'Refining Bonuses', icon: <TableChart /> },
        { path: '/tables/market', name: 'Market Prices', icon: <Store /> },
        { isDivider: true },
        { path: '/loadouts/lasers', name: 'Mining Lasers', icon: <LaserIcon /> },
        { path: '/loadouts/modules', name: 'Mining Modules & Gadgets', icon: <ModuleIcon /> },
      ],
    },
    {
      path: '/about',
      name: 'About',
      icon: <Info />,
      children: [
        { path: '/about/general', name: 'About Regolith Co.', icon: <Info /> },
        { isDivider: true },
        { path: '/about/acknowledgements', name: 'Acknowledgements', icon: <Celebration /> },
        { path: '/about/faq', name: 'FAQ', icon: <QuestionAnswer /> },
        { path: '/about/support-us', name: 'Support Us', icon: <Coffee /> },
        { path: '/about/get-help', name: 'Get Help', icon: <HelpCenter /> },
        { path: '/about/release-notes', name: 'Release Notes', icon: <NewReleases /> },
      ],
    },
  ]

  const profileMenu: MenuItemType[] = [
    { path: '/profile', name: 'My Profile', icon: <Person />, disabled: !userCtx.userProfile },
    { path: '/verify', name: 'Verify Account', icon: <Verified />, show: userCtx.isInitialized && !userCtx.isVerified },
    {
      path: '/',
      name: 'Logout',
      icon: <Logout />,
      show: Boolean(userCtx.isAuthenticated),
      action: () => {
        userCtx.logOut()
      },
    },
  ]

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
            onClick={handleOpenMenu('mobile')}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          {/* THis is the mobile menu */}
          <Menu
            id="menu-appbar"
            anchorEl={openMenu && openMenu.el}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(openMenu && openMenu.name === 'mobile')}
            onClose={handleCloseMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiPaper-root': {
                background: yellow[700],
                color: theme.palette.secondary.contrastText,
              },
            }}
          >
            {topBarMenu.reduce((acc, item, idx) => {
              if (item.isDivider || item.show === false) return acc
              else
                return [
                  ...acc,
                  <TopBarMenuItem isMobile handleAction={handleNavigate} key={`menuItem-${idx}`} item={item} />,
                  // item.children && (
                  //   <Divider
                  //     key={`divider-${idx}`}
                  //     sx={{
                  //       borderColor: alpha(theme.palette.secondary.contrastText, 0.2),
                  //     }}
                  //   />
                  // ),
                  (item.children || [])
                    .filter(({ isDivider }) => !isDivider)
                    .map((child, idy) => (
                      <TopBarMenuItem
                        isMobile
                        isSubMenu
                        handleAction={handleNavigate}
                        key={`menuItem-${idx}-${idy}`}
                        item={child}
                      />
                    )),
                ]
            }, [] as React.ReactNode[])}
          </Menu>
        </Box>
        {/* This is our mini menu for mobile */}
        <RockIcon sx={styles.siteIcon} />
        <Typography variant="h5" noWrap component="a" onClick={() => handleNavigate('/')} sx={styles.siteName}>
          Regolith Co.
        </Typography>
        {/* This is the login Menu for non-mobile */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {topBarMenu
            // .filter(({ isDivider }) => !isDivider)
            .map(
              ({ path, name, icon, isDivider, disabled, show, children }, idx) =>
                !isDivider &&
                show !== false && (
                  <Button
                    key={`menuItem-${idx}`}
                    startIcon={icon}
                    disabled={disabled}
                    onMouseOver={children && handleOpenMenu(name as string)}
                    onClick={() => path && handleNavigate(path)}
                    sx={{
                      background: openMenu && openMenu.name === name ? theme.palette.secondary.contrastText : undefined,
                      color: openMenu && openMenu.name === name ? theme.palette.secondary.light : 'inherit',
                    }}
                  >
                    {name}
                  </Button>
                )
            )}
          {topBarMenu
            .filter(({ disabled, show, children, isDivider }) => !disabled && show !== false && children && !isDivider)
            .map(({ name, children }, idx) => {
              return (
                <TopBarMenu
                  open={Boolean(openMenu && openMenu.name === name)}
                  name={name}
                  onClose={handleCloseMenu}
                  key={`menu-${idx}`}
                  anchorEl={openMenu && openMenu.el}
                  handleAction={handleNavigate}
                  menu={children || []}
                />
              )
            })}
        </Box>
        {/* Debugger for oauth token expiry */}
        {/* Profile icon, username and badge */}
        <div style={{ flexGrow: 1 }} />
        {IS_STAGING && '[TEST SERVER]'}
        <Box sx={{ flexGrow: 0 }}>
          {userCtx.isAuthenticated && (
            <>
              {userCtx.loading ? (
                <CircularProgress color="secondary" thickness={7} />
              ) : (
                <Button
                  onMouseOver={handleOpenMenu('profile')}
                  onClick={navigate ? () => navigate('/profile') : undefined}
                  sx={{
                    fontFamily: fontFamilies.robotoMono,
                    fontWeight: 'bold',
                    color: theme.palette.primary.contrastText,
                  }}
                  endIcon={<UserAvatar size="medium" error={Boolean(userCtx.error)} user={userCtx.userProfile} />}
                >
                  {userCtx.userProfile?.scName}
                </Button>
              )}
              <TopBarMenu
                open={Boolean(openMenu && openMenu.name === 'profile')}
                onClose={handleCloseMenu}
                anchorEl={openMenu && openMenu.el}
                handleAction={handleNavigate}
                menu={profileMenu}
              />
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
