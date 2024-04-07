import React from 'react'
import { Button, ButtonProps, Link as MuiLink, LinkProps as MuiLinkProps } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export interface MUIRouterLinkProps extends MuiLinkProps {
  localUrl: string
}

export const MUIRouterLink: React.FC<MUIRouterLinkProps> = ({ localUrl, children, ...linkProps }) => {
  return (
    <RouterLink to={localUrl} style={{ textDecoration: 'none' }}>
      <MuiLink sx={{ cursor: 'pointer' }} {...linkProps} component="span">
        {children}
      </MuiLink>
    </RouterLink>
  )
}

export interface MUIButtonRouterLinkProps extends ButtonProps {
  linkText: string
  localUrl: string
}

export const MUIButtonRouterLink: React.FC<MUIButtonRouterLinkProps> = ({ localUrl, linkText, ...buttonProps }) => {
  return (
    <RouterLink to={localUrl}>
      <Button {...buttonProps}>{linkText}</Button>
    </RouterLink>
  )
}
