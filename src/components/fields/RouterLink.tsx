import React from 'react'
import { Link, LinkProps } from 'react-router-dom'

export const RouterLink: React.FC<LinkProps> = ({ ...props }) => {
  return (
    <Link
      {...props}
      style={{
        color: 'inherit',
        textDecoration: 'none',
      }}
    />
  )
}
