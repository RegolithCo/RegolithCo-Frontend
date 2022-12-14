import * as React from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import logo from './logo.svg'

export const Main: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <img src={logo} alt="logo" width={120} height={80} />
        <Typography variant="h4" component="h1" gutterBottom>
          Main Page
        </Typography>
      </Box>
    </Container>
  )
}
