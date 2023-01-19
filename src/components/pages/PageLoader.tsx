import * as React from 'react'
import { CircularProgress, Typography } from '@mui/material'

export interface PageLoaderProps {
  title?: string
  subtitle?: string
  loading?: boolean
}

const style: Record<string, React.CSSProperties> = {
  box: {
    position: 'absolute',
    top: '80px',
    right: '40px',
    textAlign: 'center',
  },
}

export const PageLoader: React.FC<PageLoaderProps> = ({ title, subtitle, loading }) => {
  if (!loading) return null
  return (
    <div style={style.box}>
      <CircularProgress thickness={7} size={30} />
      {title && <Typography variant="body1">{title}</Typography>}
      {subtitle && <Typography variant="caption">{subtitle}</Typography>}
    </div>
  )
}
