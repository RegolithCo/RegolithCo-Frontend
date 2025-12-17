import { Box, useTheme } from '@mui/material'
import { keyframes, styled } from '@mui/material/styles'
import React, { useMemo } from 'react'

const animStar = keyframes`
  from {
    transform: translateX(0px);
  }
  to {
    transform: translateX(-2000px);
  }
`

const generateBoxShadow = (n: number, color: string) => {
  let value = `${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px ${color}`
  for (let i = 2; i <= n; i++) {
    value += `, ${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px ${color}`
  }
  return value
}

const StarLayer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'size' && prop !== 'duration' && prop !== 'shadows',
})<{ size: number; duration: string; shadows: string }>(({ size, duration, shadows }) => ({
  width: size,
  height: size,
  background: 'transparent',
  boxShadow: shadows,
  animation: `${animStar} ${duration} linear infinite`,
  '&:after': {
    content: '" "',
    position: 'absolute',
    top: '2000px',
    width: size,
    height: size,
    background: 'transparent',
    boxShadow: shadows,
  },
}))

export const StarsParallax: React.FC = () => {
  const theme = useTheme()
  const shadowsSmall = useMemo(() => generateBoxShadow(700, theme.palette.secondary.light), [])
  const shadowsMedium = useMemo(() => generateBoxShadow(200, theme.palette.secondary.main), [])
  const shadowsBig = useMemo(() => generateBoxShadow(100, theme.palette.secondary.dark), [])

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        background: `radial-gradient(ellipse at bottom, #35311b 0%, #0f0e09 100%)`,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
      }}
    >
      <StarLayer size={1} duration="100s" shadows={shadowsSmall} />
      <StarLayer size={2} duration="200s" shadows={shadowsMedium} />
      <StarLayer size={3} duration="300s" shadows={shadowsBig} />
    </Box>
  )
}
