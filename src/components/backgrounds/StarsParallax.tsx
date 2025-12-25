import { Box, useTheme } from '@mui/material'
import { darken } from '@mui/material/styles'
import React, { useRef } from 'react'

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

  React.useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const parent = canvas.parentElement
    if (!parent) return

    // Context optimization: alpha: false since we draw the background ourselves
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = window.devicePixelRatio || 1
    let animationFrameId: number
    let gradient: CanvasGradient | null = null

    // Star data structure: [x, y, z, pz] per star
    let numStars = 0
    let stars = new Float32Array(0)
    const speed = 0.6 // Slightly faster for better effect

    const initStars = (count: number, w: number, h: number) => {
      numStars = count
      stars = new Float32Array(count * 4)
      const cx = w / 2
      const cy = h / 2

      for (let i = 0; i < count; i++) {
        const idx = i * 4
        stars[idx] = Math.random() * w - cx // x
        stars[idx + 1] = Math.random() * h - cy // y
        const z = Math.random() * w
        stars[idx + 2] = z // z
        stars[idx + 3] = z // pz
      }
    }

    const setCanvasSize = (w: number, h: number) => {
      width = w
      height = h
      dpr = window.devicePixelRatio || 1

      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      // Scale context once for High DPI
      ctx.scale(dpr, dpr)

      // Pre-calculate gradient on resize
      gradient = ctx.createRadialGradient(width / 2, height, 0, width / 2, height, height)
      gradient.addColorStop(0, bgFg)
      gradient.addColorStop(1, bgMg)

      // Dynamic star count based on area
      const targetCount = Math.min(1200, Math.max(400, Math.floor((width * height) / 2500)))
      if (targetCount !== numStars) {
        initStars(targetCount, width, height)
      }
    }

    // Synchronous initial size setup to avoid "half second" delay from ResizeObserver
    const rect = parent.getBoundingClientRect()
    if (rect.width > 0 && rect.height > 0) {
      setCanvasSize(rect.width, rect.height)
    }

    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect
        if (newWidth === width && newHeight === height) continue
        setCanvasSize(newWidth, newHeight)
      }
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(parent)

    const render = () => {
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render)
        return
      }

      // Draw background gradient
      if (gradient) {
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
      } else {
        ctx.fillStyle = bgMg
        ctx.fillRect(0, 0, width, height)
      }

      const cx = width / 2
      const cy = height / 2

      const color = starColor || theme.palette.secondary.light
      ctx.fillStyle = color
      ctx.strokeStyle = color
      ctx.lineCap = 'round'

      // Batch drawing trails
      ctx.beginPath()
      for (let i = 0; i < numStars; i++) {
        const idx = i * 4
        const x = stars[idx]
        const y = stars[idx + 1]
        let z = stars[idx + 2]
        let pz = stars[idx + 3]

        // Move star closer
        z -= speed

        // Reset if it passes the screen
        if (z <= 0) {
          z = width
          pz = width
          stars[idx] = Math.random() * width - cx
          stars[idx + 1] = Math.random() * height - cy
        }

        stars[idx + 2] = z

        // Projection
        const sx = (x / z) * width + cx
        const sy = (y / z) * height + cy

        const px = (x / pz) * width + cx
        const py = (y / pz) * height + cy

        stars[idx + 3] = z // Update pz for next frame

        if (sx >= 0 && sx <= width && sy >= 0 && sy <= height) {
          ctx.moveTo(px, py)
          ctx.lineTo(sx, sy)
        }
      }
      ctx.stroke()

      // Batch drawing dots
      ctx.beginPath()
      for (let i = 0; i < numStars; i++) {
        const idx = i * 4
        const x = stars[idx]
        const y = stars[idx + 1]
        const z = stars[idx + 2]

        const r = (1 - z / width) * 1.5 // Max radius 1.5
        if (r <= 0.2) continue

        const sx = (x / z) * width + cx
        const sy = (y / z) * height + cy

        if (sx >= 0 && sx <= width && sy >= 0 && sy <= height) {
          ctx.moveTo(sx + r, sy)
          ctx.arc(sx, sy, r, 0, Math.PI * 2)
        }
      }
      ctx.fill()

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      resizeObserver.disconnect()
      cancelAnimationFrame(animationFrameId)
    }
  }, [theme, starColor, bgFg, bgMg])

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
        backgroundColor: bgMg, // Fallback background
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </Box>
  )
}
