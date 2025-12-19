import { Box, GlobalStyles, useTheme } from '@mui/material'
import { keyframes, styled } from '@mui/material/styles'
import React from 'react'
import MiningHud from './MiningHud'

// Keyframes
const noiseAnim = keyframes`
  0%, 100% {background-position: 0 0;}
  10% {background-position: -5% -10%;}
  20% {background-position: -15% 5%;}
  30% {background-position: 7% -25%;}
  40% {background-position: 20% 25%;}
  50% {background-position: -25% 10%;}
  60% {background-position: 15% 5%;}
  70% {background-position: 0 15%;}
  80% {background-position: 25% 35%;}
  90% {background-position: -10% 10%;}
`

const opacityAnim = keyframes`
  0% {opacity: .6;}
  20% {opacity:.3;}
  35% {opacity:.5;}
  50% {opacity:.8;}
  60% {opacity:.4;}
  80% {opacity:.7;}
  100% {opacity:.6;}
`

const scanlinesAnim = keyframes`
  from {
    background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, .5) 51%);
    background-size: 100% 4px;
  }
  to {
    background: linear-gradient(to bottom, rgba(0, 0, 0, .5) 50%, transparent 51%);
    background-size: 100% 4px;
  }
`

export const rgbTextAnim = keyframes`
  0% {
    text-shadow: -1px 1px 8px rgba(255, 255, 255, 0.6), 1px -1px 8px rgba(255, 255, 235, 0.7), 0px 0 1px var(--vhs-shadow-1), 0 0px 3px var(--vhs-shadow-2), 0px 0 3px var(--vhs-shadow-3), 0 0px 3px var(--vhs-shadow-4), 0px 0 3px var(--vhs-shadow-5);
  }
  25% {
    text-shadow: -1px 1px 8px rgba(255, 255, 255, 0.6), 1px -1px 8px rgba(255, 255, 235, 0.7), 0px 0 1px var(--vhs-shadow-1), 0 0px 3px var(--vhs-shadow-2), 0px 0 3px var(--vhs-shadow-3), 0 0px 3px var(--vhs-shadow-4), 0px 0 3px var(--vhs-shadow-5);
  }
  45% {
    text-shadow: -1px 1px 8px rgba(255, 255, 255, 0.6), 1px -1px 8px rgba(255, 255, 235, 0.7), 5px 0 1px var(--vhs-shadow-1), 0 5px 1px var(--vhs-shadow-2), -5px 0 1px var(--vhs-shadow-3), 0 -5px 1px var(--vhs-shadow-4), 5px 0 1px var(--vhs-shadow-5);
  }
  50% {
    text-shadow: -1px 1px 8px rgba(255, 255, 255, 0.6), 1px -1px 8px rgba(255, 255, 235, 0.7), -5px 0 1px var(--vhs-shadow-1), 0 -5px 1px var(--vhs-shadow-2), 5px 0 1px var(--vhs-shadow-3), 0 5px 1px var(--vhs-shadow-4), -5px 0 1px var(--vhs-shadow-5);
  }
  55% {
    text-shadow: -1px 1px 8px rgba(255, 255, 255, 0.6), 1px -1px 8px rgba(255, 255, 235, 0.7), 0px 0 3px var(--vhs-shadow-1), 0 0px 3px var(--vhs-shadow-2), 0px 0 3px var(--vhs-shadow-3), 0 0px 3px var(--vhs-shadow-4), 0px 0 3px var(--vhs-shadow-5);
  }
  90% {
    text-shadow: -1px 1px 8px rgba(255, 255, 255, 0.6), 1px -1px 8px rgba(255, 255, 235, 0.7), -5px 0 1px var(--vhs-shadow-1), 0 5px 1px var(--vhs-shadow-2), 5px 0 1px var(--vhs-shadow-3), 0 -5px 1px var(--vhs-shadow-4), 5px 0 1px var(--vhs-shadow-5);
  }
  100% {
    text-shadow: -1px 1px 8px rgba(255, 255, 255, 0.6), 1px -1px 8px rgba(255, 255, 235, 0.7), 5px 0 1px var(--vhs-shadow-1), 0 -5px 1px var(--vhs-shadow-2), -5px 0 1px var(--vhs-shadow-3), 0 5px 1px var(--vhs-shadow-4), -5px 0 1px var(--vhs-shadow-5);
  }
`

const typeAnim = keyframes`
  0%, 19% {opacity:0;}
  20%, 100% {opacity:1;}
`

// Styled Components
const VHSContainer = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'var(--vhs-bg)',
  overflow: 'hidden',
  zIndex: 0, // Create stacking context
  '&:before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,.4) 100%)',
    zIndex: 500,
    mixBlendMode: 'overlay',
    pointerEvents: 'none',
  },
})

const Scanlines = styled(Box)({
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  zIndex: 300,
  opacity: 0.6,
  willChange: 'opacity',
  animation: `${opacityAnim} 3s linear infinite`,
  '&:before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    background: 'linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, .5) 51%)',
    backgroundSize: '100% 4px',
    willChange: 'background, background-size',
    animation: `${scanlinesAnim} .2s linear infinite`,
  },
})

const Noise = styled(Box)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  zIndex: 400,
  opacity: 0.8,
  pointerEvents: 'none',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "url('https://ice-creme.de/images/background-noise.png')",
    pointerEvents: 'none',
  },
  '&.moving': {
    opacity: 1,
    zIndex: 450,
    '&:before': {
      willChange: 'background-position',
      animation: `${noiseAnim} 1s infinite alternate`,
    },
  },
}))

const IntroWrap = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  color: 'var(--vhs-text)',
  fontSize: '2rem',
  width: '100%',
  height: '100%',
  background: 'var(--vhs-overlay)',
})

const PlayText = styled(Box)({
  position: 'absolute',
  left: '2rem',
  top: '2rem',
  willChange: 'text-shadow',
  animation: `${rgbTextAnim} 2s steps(9) 0s infinite alternate`,
})

const Char = styled('span')<{ index: number }>(({ index }) => ({
  willChange: 'opacity',
  animation: `${typeAnim} 1.2s infinite alternate`,
  animationDelay: `${60 * index}ms`,
}))

const TimeText = styled(Box)({
  position: 'absolute',
  right: '2rem',
  top: '2rem',
  willChange: 'text-shadow',
  animation: `${rgbTextAnim} 1s steps(9) 0s infinite alternate`,
})

const RecordSpeedText = styled(Box)({
  position: 'absolute',
  left: '2rem',
  bottom: '5rem',
  willChange: 'text-shadow',
  animation: `${rgbTextAnim} 1s steps(9) 0s infinite alternate`,
})

const HudWrapper = styled(Box)({
  position: 'absolute',
  right: '5%',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 10,
})

export interface VHSBackgroundProps {
  backgroundColor?: string
  overlayColor?: string
  textColor?: string
  shadowColors?: [string, string, string, string, string]
}

export const VHSBackground: React.FC<VHSBackgroundProps> = ({
  backgroundColor = '#000',
  overlayColor = '#2b52ff',
  textColor = '#fff',
  shadowColors = [
    'rgba(251, 0, 231, 0.8)',
    'rgba(0, 233, 235, 0.8)',
    'rgba(0, 242, 14, 0.8)',
    'rgba(244, 45, 0, 0.8)',
    'rgba(59, 0, 226, 0.8)',
  ],
}) => {
  const style = {
    '--vhs-bg': backgroundColor,
    '--vhs-overlay': overlayColor,
    '--vhs-text': textColor,
    '--vhs-shadow-1': shadowColors[0],
    '--vhs-shadow-2': shadowColors[1],
    '--vhs-shadow-3': shadowColors[2],
    '--vhs-shadow-4': shadowColors[3],
    '--vhs-shadow-5': shadowColors[4],
  } as React.CSSProperties

  return (
    <VHSContainer style={style}>
      <GlobalStyles
        styles={{
          '@import': "url('https://fonts.googleapis.com/css?family=Press+Start+2P')",
        }}
      />
      <Scanlines />
      <IntroWrap>
        <Noise />
        <Noise className="moving" />

        {/* <PlayText>
          {'PLAY...'.split('').map((char, index) => (
            <Char key={index} index={index}>
              {char}
            </Char>
          ))}
        </PlayText> */}
        <TimeText>--:--</TimeText>
        <RecordSpeedText>SLP 0:00:00</RecordSpeedText>
        <HudWrapper>
          <MiningHud />
        </HudWrapper>
      </IntroWrap>
    </VHSContainer>
  )
}
