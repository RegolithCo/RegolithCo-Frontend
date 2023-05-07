import React, { ReactElement } from 'react'
import { useTheme, SxProps, Theme, Tooltip, Typography } from '@mui/material'

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({})

export interface PricesTooltipProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: ReactElement<any, any>
  placement?: 'bottom' | 'left' | 'right' | 'top'
}

export const PricesTooltip: React.FC<PricesTooltipProps> = ({ children, placement }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)

  const ttText = (
    <div>
      <Typography variant="body2" sx={{ fontWeight: 'bold' }} paragraph>
        Ore prices after 3.19
      </Typography>
      <Typography variant="body2" paragraph>
        Prices after 3.19 are dynamic and since CIG does not expose an API we can no longer calculate the values
        accurately. They are shown here are rough estimates that you should use as a guideline only.
      </Typography>
      <Typography variant="body2" paragraph>
        When you sell the materials of your work order you can enter the{' '}
        <strong style={{ color: theme.palette.secondary.main }}>Final Sell Price</strong> on the{' '}
        <strong style={{ color: theme.palette.secondary.main }}>Shares</strong> pane and then the crew shares will
        accurately reflect what everyone is owed
      </Typography>
    </div>
  )

  return (
    <Tooltip title={ttText} placement={placement || 'top'}>
      {children}
    </Tooltip>
  )
}
