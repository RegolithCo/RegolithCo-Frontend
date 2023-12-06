import * as React from 'react'

import { Badge, SvgIconProps } from '@mui/material'
import { CloudDownload, Group, Link, PhotoCamera, Share } from '@mui/icons-material'

export const ExportImageIcon: React.FC<SvgIconProps> = (props) => {
  const { sx, color, ...rest } = props

  return (
    <Badge badgeContent={<Share fontSize={'small'} color={color} />} sx={{ ...sx }}>
      <PhotoCamera color={color} {...rest} />
    </Badge>
  )
}
export const CollaborateLinkIcon: React.FC<SvgIconProps> = (props) => {
  const { sx, color, ...rest } = props

  return (
    <Badge badgeContent={<Link fontSize={'small'} color={color} />} sx={{ ...sx }}>
      <Group color={color} {...rest} />
    </Badge>
  )
}

export const DownloadJSONIcon: React.FC<SvgIconProps> = (props) => {
  const { sx, color, ...rest } = props

  return (
    // <Badge badgeContent={<span style={{ fontSize: 8 }}>JSON</span>} sx={{ ...sx }}>
    <CloudDownload color={color} {...rest} />
    // </Badge>
  )
}
