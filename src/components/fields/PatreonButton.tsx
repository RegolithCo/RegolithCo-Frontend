import { Box } from '@mui/system'
import React, { useEffect } from 'react'

export const PatreonButton = () => {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://c6.patreon.com/becomePatronButton.bundle.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <Box sx={{ width: '11rem', border: '1px solid red' }}>
      <a href="https://www.patreon.com/bePatron?u=64746907" data-patreon-widget-type="become-patron-button">
        Become a member!
      </a>
    </Box>
  )
}
