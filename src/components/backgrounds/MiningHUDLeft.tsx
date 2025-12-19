import { Box, keyframes, styled } from '@mui/material'

// Reuse the rgbTextAnim from MiningHud or define it here if not exported
const rgbTextAnim = keyframes`
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

const Container = styled(Box)({
  color: '#fdfdfd',
  fontFamily: 'monospace',
  padding: '20px',
  width: '320px',
  border: '1px solid #333',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  position: 'relative',
  // Apply the flicker animation to the container and all children
  '&, & *': {
    willChange: 'text-shadow',
    animation: `${rgbTextAnim} 2.5s steps(9) 0s infinite alternate`,
  },
})

const SVGWrap = styled(Box)({
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  zIndex: 0,
  pointerEvents: 'none',
})

const Overlay = styled(Box)({
  position: 'relative',
  zIndex: 1,
  width: '100%',
  height: '100%',
})

const MiningHUDLeft = () => {
  // Constants for SVG paths
  const arcPath = 'M 200 50 A 150 150 0 0 0 200 350'
  const innerArc = 'M 220 100 A 100 100 0 0 0 220 300'

  return (
    <Container>
      <SVGWrap>
        <svg viewBox="0 0 400 400" width="100%" height="100%">
          <path d={arcPath} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          <path d="M 125 75 A 150 150 0 0 0 50 200" fill="none" stroke="white" strokeWidth="4" />
          <path d={innerArc} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="8" strokeDasharray="2, 8" />
          <path d="M 220 180 A 100 100 0 0 0 220 250" fill="none" stroke="white" strokeWidth="10" />
          <polygon points="110,95 118,100 110,105" fill="white" />
        </svg>
      </SVGWrap>
      <Overlay>
        <Box sx={{ position: 'absolute', top: 40, right: 80, textAlign: 'center' }}>
          <Box
            sx={{
              border: '2px solid rgba(255,255,255,0.4)',
              borderTopColor: 'white',
              borderRadius: '50%',
              width: 50,
              height: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 'bold',
            }}
          >
            000
          </Box>
          <Box sx={{ fontWeight: 800, fontSize: 10, marginTop: '2px' }}>THRUST</Box>
        </Box>
        <Box sx={{ position: 'absolute', top: '15%', left: '5%', fontSize: 12, fontWeight: 900 }}>OPTIMAL</Box>
        <Box sx={{ position: 'absolute', top: '40%', left: '5%', fontSize: 12, fontWeight: 900 }}>MAX</Box>
        <Box sx={{ position: 'absolute', top: '12%', left: '28%', fontSize: 14, fontWeight: 'bold' }}>28</Box>
        <Box sx={{ position: 'absolute', top: '50%', left: '55%', transform: 'translateY(-50%)', textAlign: 'center' }}>
          <Box
            sx={{
              border: '2px solid white',
              padding: '2px 15px',
              display: 'inline-block',
              clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 15% 100%, 0% 50%)',
            }}
          >
            <span style={{ fontSize: 20, fontWeight: 'bold' }}>0</span>
          </Box>
          <Box sx={{ fontWeight: 800, fontSize: 10, marginTop: '2px' }}>VEL M/S</Box>
        </Box>
        <Box sx={{ position: 'absolute', bottom: 120, right: 120, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 24,
              height: 24,
              border: '2px solid white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ width: 4, height: 4, background: 'white', borderRadius: '50%' }} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontSize: 16, fontWeight: 'bold' }}>0.0</span>
            <span style={{ fontWeight: 800, fontSize: 10, marginTop: '2px' }}>GSAF</span>
          </Box>
        </Box>
        <Box sx={{ position: 'absolute', bottom: 30, right: 50, fontWeight: 900, fontSize: 18 }}>LASER RAN</Box>
      </Overlay>
    </Container>
  )
}

export default MiningHUDLeft
