import React, { useEffect, useRef } from 'react'
import { useTheme } from '@mui/material'

interface MatrixBackgroundProps {
  color?: string
  redrawInterval?: number
  backgroundColor?: string
}

export const MatrixBackground: React.FC<MatrixBackgroundProps> = ({ color, backgroundColor, redrawInterval = 33 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const theme = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height

    const chineseCharacters = '富荣兴财石岩矿磊磐土地尘壤山峰金银铜铁采掘晶宝珠玉'
    const japaneseCharacters =
      'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
    const koreanCharacters = '가나다라마바사아자차카타파하거너더러머버서어저처커터퍼허고노도로모보소오조초코토포호'
    const thaiCharacters = 'กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลวศษสหฬอฮ'
    const arabicCharacters = 'ابتثجحخدذرزسشصضطظعغفقكلمنهويءئؤ'
    const numbers = '0123456789'
    const letters =
      chineseCharacters +
      japaneseCharacters +
      koreanCharacters +
      thaiCharacters +
      arabicCharacters +
      numbers +
      numbers +
      numbers +
      numbers
    const fontSize = 14

    // Vertical columns
    const columns = Math.ceil(width / fontSize)
    const drops: number[] = []
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * (height / fontSize)
    }

    // Horizontal rows
    const rows = Math.ceil(height / fontSize)
    const horizontalDrops: number[] = []
    for (let i = 0; i < rows; i++) {
      horizontalDrops[i] = Math.random() * columns
    }

    const draw = () => {
      // Black with opacity to create the trail effect
      ctx.fillStyle = backgroundColor || 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = color || theme.palette.primary.main
      ctx.font = `${fontSize}px monospace`

      // Draw Vertical
      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length))
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }

      // Draw Horizontal
      for (let i = 0; i < horizontalDrops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length))
        ctx.fillText(text, horizontalDrops[i] * fontSize, i * fontSize)

        if (horizontalDrops[i] * fontSize > width && Math.random() > 0.975) {
          horizontalDrops[i] = 0
        }
        horizontalDrops[i]++
      }
    }

    let animationFrameId: number
    let lastTime = 0

    const render = (time: number) => {
      const deltaTime = time - lastTime
      if (deltaTime >= redrawInterval) {
        draw()
        lastTime = time
      }
      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height

      const newColumns = Math.ceil(width / fontSize)
      const newRows = Math.ceil(height / fontSize)

      // Resize vertical
      if (newColumns > drops.length) {
        for (let i = drops.length; i < newColumns; i++) {
          drops[i] = Math.random() * (height / fontSize)
        }
      }

      // Resize horizontal
      if (newRows > horizontalDrops.length) {
        for (let i = horizontalDrops.length; i < newRows; i++) {
          horizontalDrops[i] = Math.random() * (width / fontSize)
        }
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [color, backgroundColor, theme.palette.primary.main, redrawInterval])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0, // Behind content
      }}
    />
  )
}
