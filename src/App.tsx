import * as React from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import logo from './logo.svg'

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

function App() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <img src={logo} alt="logo" width={120} height={80} />
        <Typography variant="h4" component="h1" gutterBottom>
          Create React App example
        </Typography>
        <Copyright />
      </Box>
    </Container>
  )
}

export default App
