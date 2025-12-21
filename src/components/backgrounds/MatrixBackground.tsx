import React, { useEffect, useRef } from 'react'
import { useTheme } from '@mui/material'

interface MatrixBackgroundProps {
  color?: string
  redrawInterval?: number
  backgroundColor?: string
}

const CHINESE_CHARACTERS = '富荣兴财石岩矿磊磐土地尘壤山峰金银铜铁采掘晶宝珠玉'
const JAPANESE_CHARACTERS =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ마미무메모야유요라リルレロワヲン'
const KOREAN_CHARACTERS = '가나다라마바사아자차카타파하거너더러머버서어저처커터퍼허고노도로모보소오조초코토포호'
const THAI_CHARACTERS = 'กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลวศษสหฬอฮ'
const ARABIC_CHARACTERS = 'ابتثجحخدذرزسشصضطظعغفقكلمنهويءئؤ'
const FUN_UTF8_CHARACTERS = '◊○☼☽☾♠♣♥♦♪♫☯☢☣☤⚕⚖⚗⚙⚛⚡☭✈✉✆☎☏✂✃✄✒✍✓✔✕✖✗✘❄❇❈❉❊'
const NUMBERS = '0123456789'

const LETTERS =
  CHINESE_CHARACTERS +
  JAPANESE_CHARACTERS +
  KOREAN_CHARACTERS +
  THAI_CHARACTERS +
  ARABIC_CHARACTERS +
  NUMBERS.repeat(4) +
  FUN_UTF8_CHARACTERS

const FONT_SIZE = 24

export const MatrixBackground: React.FC<MatrixBackgroundProps> = ({ color, backgroundColor, redrawInterval = 33 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const theme = useTheme()
  const activeColor = color || theme.palette.primary.main
  const activeBgColor = backgroundColor || 'rgba(0, 0, 0, 0.05)'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // hinting the browser we won't read back the pixels
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true })
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = window.devicePixelRatio || 1

    // Character Atlas for Glyph pre-rendering
    const atlasCanvas = document.createElement('canvas')
    const atlasCtx = atlasCanvas.getContext('2d', { alpha: true })
    const populateAtlas = (textColor: string) => {
      if (!atlasCtx) return
      const charWidth = FONT_SIZE
      const charHeight = FONT_SIZE
      atlasCanvas.width = charWidth * LETTERS.length
      atlasCanvas.height = charHeight

      atlasCtx.font = `${FONT_SIZE}px monospace`
      atlasCtx.fillStyle = textColor
      atlasCtx.textAlign = 'left'
      atlasCtx.textBaseline = 'top'

      for (let i = 0; i < LETTERS.length; i++) {
        atlasCtx.fillText(LETTERS[i], i * charWidth, 0)
      }
    }

    // Using TypedArrays for better performance and RAM safety
    let verticalDrops = new Uint16Array(0)
    let horizontalDrops = new Uint16Array(0)

    const updateCanvasSize = () => {
      dpr = window.devicePixelRatio || 1
      width = window.innerWidth
      height = window.innerHeight

      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      canvas.width = width * dpr
      canvas.height = height * dpr

      ctx.scale(dpr, dpr)
      populateAtlas(activeColor)

      const newColumns = Math.ceil(width / FONT_SIZE)
      const newRows = Math.ceil(height / FONT_SIZE)

      if (newColumns !== verticalDrops.length) {
        const oldDrops = verticalDrops
        verticalDrops = new Uint16Array(newColumns)
        verticalDrops.set(oldDrops.subarray(0, Math.min(oldDrops.length, newColumns)))
        for (let i = oldDrops.length; i < newColumns; i++) {
          verticalDrops[i] = Math.random() * (height / FONT_SIZE)
        }
      }

      if (newRows !== horizontalDrops.length) {
        const oldDrops = horizontalDrops
        horizontalDrops = new Uint16Array(newRows)
        horizontalDrops.set(oldDrops.subarray(0, Math.min(oldDrops.length, newRows)))
        for (let i = oldDrops.length; i < newRows; i++) {
          horizontalDrops[i] = Math.random() * (width / FONT_SIZE)
        }
      }
    }

    updateCanvasSize()

    const draw = () => {
      ctx.fillStyle = activeBgColor
      ctx.fillRect(0, 0, width, height)

      const charWidth = FONT_SIZE
      const lettersLength = LETTERS.length

      // Draw Vertical
      for (let i = 0; i < verticalDrops.length; i++) {
        const charIndex = Math.floor(Math.random() * lettersLength)
        const x = i * FONT_SIZE
        const y = verticalDrops[i] * FONT_SIZE

        // Use atlas instead of fillText for performance
        ctx.drawImage(atlasCanvas, charIndex * charWidth, 0, charWidth, charWidth, x, y, charWidth, charWidth)

        if (y > height && Math.random() > 0.975) {
          verticalDrops[i] = 0
        } else {
          verticalDrops[i]++
        }
      }

      // Draw Horizontal
      for (let i = 0; i < horizontalDrops.length; i++) {
        const charIndex = Math.floor(Math.random() * lettersLength)
        const x = horizontalDrops[i] * FONT_SIZE
        const y = i * FONT_SIZE

        ctx.drawImage(atlasCanvas, charIndex * charWidth, 0, charWidth, charWidth, x, y, charWidth, charWidth)

        if (x > width && Math.random() > 0.975) {
          horizontalDrops[i] = 0
        } else {
          horizontalDrops[i]++
        }
      }
    }

    let animationFrameId: number
    let lastTime = 0
    let drawCount = 0
    const fastInterval = 20
    const targetFastFrames = Math.max(Math.ceil(height / FONT_SIZE), Math.ceil(width / FONT_SIZE))
    let isPaused = false

    const render = (time: number) => {
      if (isPaused) return

      const currentInterval = drawCount < targetFastFrames ? fastInterval : redrawInterval
      const deltaTime = time - lastTime

      if (deltaTime >= currentInterval) {
        draw()
        lastTime = time
        drawCount++
      }
      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    // Visibility API listeners
    const handleVisibilityChange = () => {
      isPaused = document.hidden
      if (!isPaused) {
        lastTime = performance.now()
        animationFrameId = requestAnimationFrame(render)
      } else {
        cancelAnimationFrame(animationFrameId)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // DPR Change listener (monitor switch)
    let mqList: MediaQueryList | null = null
    const handleDPRChange = () => {
      updateCanvasSize()
      setupDPRListener()
    }

    const setupDPRListener = () => {
      if (mqList) mqList.removeEventListener('change', handleDPRChange)
      const currentDPR = window.devicePixelRatio || 1
      mqList = window.matchMedia(`screen and (min-resolution: ${currentDPR}dppx)`)
      mqList.addEventListener('change', handleDPRChange, { once: true })
    }
    setupDPRListener()

    let resizeTimeout: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(updateCanvasSize, 100)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (mqList) mqList.removeEventListener('change', handleDPRChange)
      clearTimeout(resizeTimeout)
    }
  }, [activeColor, activeBgColor, redrawInterval])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none', // Ensure it doesn't block interactions
      }}
    />
  )
}
