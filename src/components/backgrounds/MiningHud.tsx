import { Box, keyframes, styled } from '@mui/material'
import React from 'react'

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
  // Apply the flicker animation to the container and all children
  '&, & *': {
    willChange: 'text-shadow',
    animation: `${rgbTextAnim} 2s steps(9) 0s infinite alternate`,
  },
})

const Header = styled(Box)({
  fontSize: '24px',
  fontWeight: 'bold',
  borderBottom: '2px solid #e8c547',
  paddingBottom: '4px',
  marginBottom: '15px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
})

const SubHeader = styled(Box)({
  color: '#e8c547',
  fontSize: '16px',
  marginBottom: '15px',
  fontWeight: 'bold',
})

const Row = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  margin: '8px 0',
  fontSize: '18px',
  fontWeight: '900',
  textShadow: '0 0 5px rgba(255,255,255,0.3)',
})

const DifficultyBox = styled(Box)({
  borderLeft: '2px solid #e8c547',
  borderRight: '2px solid #e8c547',
  borderRadius: '10px',
  margin: '15px 0',
  padding: '5px',
  textAlign: 'center',
  color: '#76b947',
  fontSize: '18px',
  fontWeight: 'bold',
  position: 'relative',
})

const CompositionHeader = styled(Box)({
  borderTop: '2px solid #e8c547',
  marginTop: '20px',
  paddingTop: '10px',
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '18px',
  fontWeight: 'bold',
})

const ProgressBar = styled(Box)({
  border: '2px solid #e8c547',
  height: '24px',
  margin: '10px 0',
  display: 'flex',
  padding: '2px',
  gap: '2px',
})

const Segment = styled(Box)({
  backgroundColor: '#fff',
  flex: '1',
  height: '100%',
})

const Footer = styled(Box)({
  color: '#e8c547',
  fontSize: '16px',
  fontWeight: 'bold',
  marginTop: '10px',
})

const MiningHud = () => {
  return (
    <Container>
      <Header>
        <span>Scan Results</span>
      </Header>

      <SubHeader>Asteroid (Q-Type)</SubHeader>

      <Row>
        <span>Mass:</span>
        <span>NaN</span>
      </Row>
      <Row>
        <span>Resistance:</span>
        <span>0%</span>
      </Row>
      <Row>
        <span>Instability:</span>
        <span>0.00</span>
      </Row>

      <DifficultyBox>
        <Box component="span" sx={{ position: 'absolute', left: '-5px', top: '0' }}>
          (
        </Box>
        GNARLY
        <Box component="span" sx={{ position: 'absolute', right: '-5px', top: '0' }}>
          )
        </Box>
      </DifficultyBox>

      <CompositionHeader>
        <span>Composition</span>
        <span>N.XX SCU</span>
      </CompositionHeader>

      <ProgressBar>
        {[...Array(28)].map((_, i) => (
          <Segment key={i} />
        ))}
      </ProgressBar>

      <Footer>100.00% GARGONITE ORE</Footer>
    </Container>
  )
}

export default MiningHud
