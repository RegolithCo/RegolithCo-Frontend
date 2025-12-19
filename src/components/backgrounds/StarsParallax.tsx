import { Box, useTheme } from '@mui/material'
import { darken } from '@mui/material/styles'
import React, { useEffect, useRef } from 'react'

interface StarsParallaxProps {
  starColor?: string
  color1?: string
  color2?: string
}

export const StarsParallax: React.FC<StarsParallaxProps> = ({ starColor, color1, color2 }) => {
  const theme = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const bgFg = darken(color1 || theme.palette.secondary.dark, 0.6)
  const bgMg = darken(color2 || theme.palette.primary.main, 0.9)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    let animationFrameId: number

    const stars: { x: number; y: number; z: number; pz: number }[] = []
    const numStars = 800
    const speed = 1

    // Initialize stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width - width / 2,
        y: Math.random() * height - height / 2,
        z: Math.random() * width,
        pz: Math.random() * width,
      })
    }

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      const cx = width / 2
      const cy = height / 2

      ctx.fillStyle = starColor || theme.palette.secondary.light
      ctx.strokeStyle = starColor || theme.palette.secondary.light

      for (let i = 0; i < numStars; i++) {
        const star = stars[i]

        // Move star closer
        star.z -= speed

        // Reset if it passes the screen
        if (star.z <= 0) {
          star.z = width
          star.pz = width
          star.x = Math.random() * width - cx
          star.y = Math.random() * height - cy
        }

        // Calculate position
        const x = (star.x / star.z) * width + cx
        const y = (star.y / star.z) * height + cy

        // Calculate size based on depth
        const r = (1 - star.z / width) * 2.5

        // Calculate previous position for trail
        const px = (star.x / star.pz) * width + cx
        const py = (star.y / star.pz) * height + cy

        star.pz = star.z

        if (x >= 0 && x <= width && y >= 0 && y <= height) {
          ctx.beginPath()
          ctx.lineWidth = r
          ctx.moveTo(px, py)
          ctx.lineTo(x, y)
          ctx.stroke()

          ctx.beginPath()
          if (r > 0) ctx.arc(x, y, r, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [theme])

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        background: `radial-gradient(ellipse at bottom, ${bgFg} 0%, ${bgMg} 100%)`,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </Box>
  )
}
