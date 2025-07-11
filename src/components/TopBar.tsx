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
import {
  alpha,
  Avatar,
  Badge,
  CircularProgress,
  keyframes,
  PaletteColor,
  SxProps,
  Theme,
  Tooltip,
  useTheme,
} from '@mui/material'
import { fontFamilies } from '../theme'
import {
  AccountCircle,
  BugReport,
  Calculate,
  Celebration,
  Coffee,
  Dashboard,
  EmojiEvents,
  Engineering,
  Explore,
  Group,
  Info,
  KeyboardArrowDown,
  KeyboardArrowUp,
  ListAlt,
  Login,
  Logout,
  NewReleases,
  NoAccounts,
  Person,
  QuestionAnswer,
  Settings,
  StopScreenShare,
  Store,
  Storefront,
  TableChart,
  Verified,
} from '@mui/icons-material'
import { GemIcon, RockIcon, SurveyCorpsIcon } from '../icons'
import { UserAvatar } from './UserAvatar'
import { ModuleIcon } from '../icons/Module'
import { TopBarMenu, TopBarMenuItem } from './TopBarMenu'
import { LaserIcon } from '../icons/Laser'
import { AppContext } from '../context/app.context'
import { ProfileTabsEnum } from './pages/ProfilePage'
import { Link } from 'react-router-dom'
import { ScreenshareContext } from '../context/screenshare.context'
import { LoginContext, UserProfileContext } from '../context/auth.context'
// import { feedbackIntegration } from '@sentry/react'

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
const IS_STAGING = STAGE === 'staging'

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  appBar: {
    fontFamily: fontFamilies.robotoMono,
    bgcolor: IS_STAGING ? '#ff4242' : yellow[700],
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
    position: 'relative',
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

export const TopBar: React.FC = () => {
  const [openMenu, setMenuOpen] = React.useState<null | { name: string; el: HTMLElement; width: number }>(null)

  const theme = useTheme()
  const styles = stylesThunk(theme)
  const { hideNames, setHideNames, maintenanceMode } = React.useContext(AppContext)
  const { isAuthenticated, loading: loginLoading, authLogOut, setPopupOpen } = React.useContext(LoginContext)
  const { isInitialized, isVerified, loading: profileLoading, myProfile, error } = React.useContext(UserProfileContext)
  const { isScreenSharing, stopScreenCapture } = React.useContext(ScreenshareContext)

  const combinedLoading = loginLoading || profileLoading

  const handleOpenMenu = (name: string) => (event: React.MouseEvent<HTMLElement>) => {
    setMenuOpen({ name: name, el: event.currentTarget, width: event.currentTarget.clientWidth })
  }

  const handleCloseMenu = () => {
    // Slight timeout then close
    setMenuOpen(null)
  }

  const pulse = (color: PaletteColor) => keyframes`
    0% { 
      box-shadow: 0 0 0 0 transparent; 
      background-color: ${color.dark} 
    }
    50% { 
      box-shadow: 0 0 5px 5px ${alpha(color.light, 0.5)}; 
      background-color: ${color.light} 
    }
    100% { 
      box-shadow: 0 0 0 0 transparent; 
      background-color:  ${color.dark}
    }
  `
  const topBarMenu: MenuItemType[] = [
    //
    { path: '/dashboard', name: 'Dashboard', icon: <Dashboard />, disabled: Boolean(maintenanceMode) },
    {
      name: 'Calculators',
      icon: <Calculate />,
      path: '/workorder',
      children: [
        { path: '/workorder', name: 'Work Order', icon: <Engineering /> },
        { path: '/cluster', name: 'Rock / Cluster Calculator', icon: <RockIcon /> },
        { path: '/loadouts', name: 'Ship Mining Loadouts', icon: <ModuleIcon /> },
        { path: '/market-price', name: 'Market Price Calculator', icon: <Storefront /> },
      ],
    },
    {
      path: '/tables/ore',
      name: 'Data',
      icon: <TableChart />,
      children: [
        {
          path: '/survey/about',
          name: 'Survey Corps',
          icon: <SurveyCorpsIcon />,
        },
        {
          path: '/survey/ores',
          name: 'Ore Types by Location',
          icon: (
            <Badge badgeContent={<Explore sx={{ fontSize: 14 }} />}>
              <RockIcon />
            </Badge>
          ),
        },
        {
          path: '/survey/rock_class',
          name: 'Rock Type Compositions',
          icon: (
            <Badge badgeContent={<ListAlt sx={{ fontSize: 14 }} />}>
              <RockIcon />
            </Badge>
          ),
        },
        {
          path: '/survey/class_location',
          name: 'Rock Types by Location',
          icon: (
            <Badge badgeContent={<Explore sx={{ fontSize: 14 }} />}>
              <RockIcon />
            </Badge>
          ),
        },
        {
          path: '/survey/gems',
          name: 'ROC / FPS Mining Ores',
          icon: <GemIcon />,
        },
        {
          path: '/survey/leaderboard',
          name: 'Leaderboards',
          icon: <EmojiEvents />,
        },
        { isDivider: true },
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
        // {
        //   name: 'Report a bug',
        //   icon: <BugReport />,
        //   action: async () => {
        //     const feedback = feedbackIntegration({
        //       colorScheme: 'dark',
        //       showEmail: false,
        //       isNameRequired: true,
        //       isEmailRequired: false,
        //       nameLabel: 'RSI Username',
        //       namePlaceholder: 'miner-joe',
        //       messagePlaceholder:
        //         "What's the bug? What did you do to cause it? What did you expect? What happened instead?",
        //       // messagePlaceholder
        //       // Disable the injection of the default widget
        //       autoInject: false,
        //     })
        //     const form = await feedback.createForm()
        //     form.appendToDom()
        //     form.open()
        //   },
        // },
        { isDivider: true },
        { path: '/about/general', name: 'About Regolith Co.', icon: <Info /> },
        { isDivider: true },
        { path: '/about/resources', name: 'Learn to Mine', icon: <RockIcon /> },
        { path: '/about/faq', name: 'Help / FAQ', icon: <QuestionAnswer /> },
        { path: '/about/acknowledgements', name: 'Acknowledgements', icon: <Celebration /> },
        { path: '/about/support-us', name: 'Support Regolith', icon: <Coffee /> },
        { path: '/about/release-notes', name: 'Release Notes', icon: <NewReleases /> },
      ],
    },
  ]

  const profileMenu: MenuItemType[] = [
    { path: `/${ProfileTabsEnum.PROFILE}`, name: 'My Profile', icon: <Person />, disabled: !myProfile },
    {
      path: `/${ProfileTabsEnum.SURVEY}`,
      name: 'Survey Corps',
      icon: (
        <Avatar
          src="/images/icons/SurveyorLogo128.png"
          sx={{
            width: '1.5rem',
            height: '1.5rem',
            borderRadius: '50%',
            border: '1px solid #000',
            backgroundColor: 'white',
          }}
        />
      ),
      disabled: !myProfile,
    },
    { path: `/${ProfileTabsEnum.FRIENDS}`, name: 'Manage Friends', icon: <Group />, disabled: !myProfile },
    {
      path: `/${ProfileTabsEnum.SESSION_DEFAULTS}`,
      name: 'Session Defaults',
      icon: <Settings />,
      disabled: !myProfile,
    },
    {
      path: '/verify',
      name: 'Verify Account',
      icon: <Verified color="error" />,
      show: isInitialized && !isVerified,
    },
    { isDivider: true },
    {
      name: `Streaming Mode: ${hideNames ? 'ON' : 'OFF'}`,
      action: () => setHideNames(!hideNames),
      icon: hideNames ? <NoAccounts /> : <AccountCircle />,
      disabled: !myProfile,
    },
    { isDivider: true },
    {
      path: '/',
      name: 'Logout',
      icon: <Logout />,
      show: Boolean(isAuthenticated && authLogOut),
      action: () => {
        if (authLogOut) authLogOut()
      },
    },
  ]

  return (
    <AppBar position="static" sx={styles.appBar}>
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
          {!maintenanceMode && (
            <Menu
              id="menu-appbar"
              anchorEl={openMenu?.el ? openMenu.el : undefined}
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
              onClick={handleCloseMenu}
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
                    <TopBarMenuItem isMobile key={`menuItem-${idx}`} item={item} />,
                    (item.children || [])
                      .filter(({ isDivider }) => !isDivider)
                      .map((child, idy) => (
                        <TopBarMenuItem isMobile isSubMenu key={`menuItem-${idx}-${idy}`} item={child} />
                      )),
                  ]
              }, [] as React.ReactNode[])}
            </Menu>
          )}
        </Box>
        {/* This is our mini menu for mobile */}
        <RockIcon sx={styles.siteIcon} />
        {IS_STAGING && (
          <Box
            sx={{
              pointerEvents: 'none',
              position: 'absolute',
              top: 10,
              left: 0,
              fontSize: '0.5rem',
              color: 'black',
              // textShadow: '0 0 5px white; 0 0 10px white',
              fontFamily: fontFamilies.robotoMono,
              // transform: 'rotate(-20deg) translateY(-50%)',
              fontWeight: 700,
            }}
          >
            [TEST SERVER]
          </Box>
        )}
        <Typography variant="h5" noWrap component={Link} to="/" sx={styles.siteName}>
          Regolith Co.
        </Typography>
        {/* This is the login Menu for non-mobile */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {!maintenanceMode &&
            topBarMenu
              // .filter(({ isDivider }) => !isDivider)
              .map(
                ({ path, name, icon, isDivider, disabled, show, children }, idx) =>
                  !isDivider &&
                  show !== false && (
                    <Button
                      key={`menuItem-${idx}`}
                      startIcon={icon}
                      endIcon={
                        children ? (
                          openMenu && openMenu.name === name ? (
                            <KeyboardArrowDown />
                          ) : (
                            <KeyboardArrowUp />
                          )
                        ) : undefined
                      }
                      disabled={disabled}
                      onMouseOver={children && handleOpenMenu(name as string)}
                      component={Link}
                      to={path || '/'}
                      sx={{
                        background:
                          openMenu && openMenu.name === name ? theme.palette.secondary.contrastText : undefined,
                        color: openMenu && openMenu.name === name ? theme.palette.secondary.light : 'inherit',
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                      }}
                    >
                      {name}
                    </Button>
                  )
              )}
          {!maintenanceMode &&
            topBarMenu
              .filter(
                ({ disabled, show, children, isDivider }) => !disabled && show !== false && children && !isDivider
              )
              .map(({ name, children }, idx) => {
                return (
                  <TopBarMenu
                    open={Boolean(openMenu && openMenu.name === name)}
                    name={name}
                    anchorWidth={openMenu && openMenu.width}
                    onClose={handleCloseMenu}
                    key={`menu-${idx}`}
                    anchorEl={openMenu?.el ? openMenu.el : undefined}
                    menu={children || []}
                  />
                )
              })}
        </Box>
        {/* Debugger for oauth token expiry */}
        {/* Profile icon, username and badge */}
        <div style={{ flexGrow: 1 }} />
        {isScreenSharing && (
          <Tooltip title="Stop sharing screens with Regolith">
            <IconButton
              color="inherit"
              onClick={() => stopScreenCapture()}
              sx={{
                position: 'relative',
                backgroundColor: alpha(theme.palette.error.dark, 0.5),
                animation: `${pulse(theme.palette.error)} 1.5s infinite`,
              }}
            >
              <StopScreenShare />
            </IconButton>
          </Tooltip>
        )}
        <Box sx={{ flexGrow: 0 }}>
          {isAuthenticated && hideNames && (
            <Tooltip title={`names disabled for streaming`}>
              <IconButton
                color="inherit"
                sx={{ color: 'red', cursor: 'default' }}
                disableFocusRipple
                disableRipple
                disableTouchRipple
              >
                <NoAccounts />
              </IconButton>
            </Tooltip>
          )}
          {isAuthenticated && (
            <>
              {combinedLoading ? (
                <CircularProgress color="secondary" thickness={7} />
              ) : (
                <Button
                  onMouseOver={handleOpenMenu('profile')}
                  component={Link}
                  to="/profile"
                  sx={{
                    fontFamily: fontFamilies.robotoMono,
                    fontWeight: 'bold',
                    color: theme.palette.primary.contrastText,
                  }}
                  endIcon={<UserAvatar size="medium" error={Boolean(error)} user={myProfile} privacy={hideNames} />}
                >
                  {hideNames ? 'YOU' : myProfile?.scName}
                </Button>
              )}
              <TopBarMenu
                open={Boolean(openMenu && openMenu.name === 'profile')}
                onClose={handleCloseMenu}
                anchorEl={openMenu?.el ? openMenu.el : undefined}
                anchorWidth={openMenu && openMenu.width}
                anchorAlign="right"
                menu={profileMenu}
              />
            </>
          )}
          {!maintenanceMode && !isAuthenticated && (
            <Button color="inherit" onClick={() => setPopupOpen()} startIcon={<Login />}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
