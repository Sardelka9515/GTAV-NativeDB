import { AppBar as MaterialAppBar, Box, IconButton, Link, ListItemIcon, Menu, MenuItem, Slide, Toolbar, Typography } from '@mui/material'
import { GitHub as GithubIcon, MoreVert as MoreIcon, Search as SearchIcon, Settings as SettingsIcon, ShowChart as StatsIcon, Code as CodeIcon, Apps as AppsIcon } from '@mui/icons-material'
import React, { MouseEvent, MouseEventHandler, useCallback, useMemo, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { AppBarAction as AppBarActionProps } from '.'
import { useAppBarSettings } from '../../hooks'
import MobileSearch from './MobileSearch'
import { AppBarProps } from './model'
import SettingsDrawer from './SettingsDrawer'
import StatsDialog from './StatsDialog'
import StatusButton from './StatusButton'
import AppsDialog from './AppsDialog'

function AppBarAction({ text, mobileIcon, buttonProps: { href, target, onClick, ...buttonProps } }: AppBarActionProps) {
  const navigate = useNavigate()

  const handleClick = useCallback<MouseEventHandler<HTMLElement>>(e => {
    if (href) {
      if (href.includes('://') || target) {
        window.open(href, target)
      }
      else {
        navigate(href)
      }
    }

    onClick && onClick(e)
  }, [href, target, onClick, navigate])

  return (
    <MenuItem onClick={handleClick}>
      {mobileIcon && <ListItemIcon>
        {React.createElement(mobileIcon)}
      </ListItemIcon>}
      {text}
    </MenuItem>
  )
}

function Mobile({ ...rest }: AppBarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [statsDialog, setStatsDialog] = useState(false)
  const [appsDialog, setAppsDialog] = useState(false)
  const settings = useAppBarSettings()

  const handleSettingsOpen = useCallback(() => {
    setSettingsOpen(true)
  }, [setSettingsOpen])

  const handleSettingsClose = useCallback(() => {
    setSettingsOpen(false)
  }, [setSettingsOpen])

  const handleMenuOpen = useCallback((event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }, [setAnchorEl])

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null)
  }, [setAnchorEl])

  const handleSearchOpen = useCallback(() => {
    setSearchOpen(true)
  }, [setSearchOpen])

  const handleSearchClose = useCallback(() => {
    setSearchOpen(false)
  }, [setSearchOpen])

  const handleStatsDialogOpen = useCallback(() => {
    setStatsDialog(true)
  }, [setStatsDialog])

  const handleStatsDialogClose = useCallback(() => {
    setStatsDialog(false)
  }, [setStatsDialog])

  const handleAppsDialogOpen = useCallback(() => {
    setAppsDialog(true)
  }, [setAppsDialog])

  const handleAppsDialogClose = useCallback(() => {
    setAppsDialog(false)
  }, [setAppsDialog])

  const actions: AppBarActionProps[] = useMemo(() => [
    ...(settings.actions ?? []),
    {
      text: 'Settings',
      mobileIcon: SettingsIcon,
      buttonProps: {
        onClick: handleSettingsOpen
      }
    },
    {
      text: 'Stats',
      mobileIcon: StatsIcon,
      buttonProps: {
        onClick: handleStatsDialogOpen
      }
    },
    {
      text: 'Generate Code',
      mobileIcon: CodeIcon,
      buttonProps: {
        href: '/generate-code'
      }
    },
    {
      text: 'Apps',
      mobileIcon: AppsIcon,
      buttonProps: {
        onClick: handleAppsDialogOpen
      }
    },
    {
      text: 'View on Github',
      mobileIcon: GithubIcon,
      buttonProps: {
        href: 'https://github.com/DottieDot/GTAV-NativeDB',
        target: '_blank'
      }
    }
  ], [settings, handleSettingsOpen, handleStatsDialogOpen, handleAppsDialogOpen])

  return (
    <Box {...rest}>
      <StatsDialog open={statsDialog} onClose={handleStatsDialogClose} />
      <AppsDialog open={appsDialog} onClose={handleAppsDialogClose} />
      <SettingsDrawer open={settingsOpen} onClose={handleSettingsClose} />
      <MaterialAppBar position="sticky">
        {settings.search && (
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <Slide in={searchOpen} timeout={100} direction="down">
              <Box sx={{ height: '100%', position: 'relative', zIndex: 1 }}>
                <MobileSearch
                  search={settings.search}
                  onClose={handleSearchClose}
                  visible={searchOpen}
                />
              </Box>
            </Slide>
          </Box>
        )}
        <Toolbar>
          <Typography variant="h6" component="div">
            <Link
              to="/natives"
              color="inherit"
              underline="none"
              component={RouterLink}
            >
              {settings?.title ?? 'GTA V Native Reference'}
            </Link>
          </Typography>
          <Box
            sx={{ display: 'flex', flex: 1 }}
          />
          <StatusButton />
          {settings?.search && (
            <IconButton onClick={handleSearchOpen} color="inherit" aria-label="search">
              <SearchIcon />
            </IconButton>
          )}

          <IconButton onClick={handleMenuOpen} color="inherit" aria-label="more">
            <MoreIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
          >
            {actions.map(action => (
              <AppBarAction
                key={action.text}
                {...action}
              />
            ))}
          </Menu>
        </Toolbar>
      </MaterialAppBar>
    </Box>
  )
}
export default Mobile
