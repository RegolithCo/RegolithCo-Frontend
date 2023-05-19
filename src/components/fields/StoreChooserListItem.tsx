import * as React from 'react'

import {
  Box,
  Chip,
  ListItemButton,
  ListItemText,
  Stack,
  SxProps,
  Theme,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { AnyOreEnum, OreSummary, StoreChoice, getOreName, lookups } from '@regolithco/common'
import { MValueFormat } from '../fields/MValue'
import { MValueFormatter } from '../fields/MValue'
import { fontFamilies } from '../../theme'
import { alpha } from '@mui/material'

export interface StoreChooserListItemProps {
  storeChoice: StoreChoice
  ores: OreSummary
  onClick: (storeChoice: StoreChoice) => void
  compact?: boolean
  isSelected?: boolean
  isMax?: boolean
  priceColor?: string
}

const styleThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  tinyChips: {
    fontSize: '0.7rem',
    mr: 0.5,
    height: 14,
    borderRadius: 1,
    fontWeight: 'bold',
  },
})

export const StoreChooserListItem: React.FC<StoreChooserListItemProps> = ({
  ores,
  storeChoice,
  priceColor,
  onClick,
  compact,
  isSelected,
  isMax,
}) => {
  const theme = useTheme()
  const styles = styleThunk(theme)

  return (
    <ListItemButton
      onClick={() => onClick && onClick(storeChoice)}
      sx={{
        borderRadius: 3,
        // background: '#222',
        boxShadow: isSelected ? `0 0 10px 2px ${theme.palette.primary.light}` : 'none',
        background: isSelected ? alpha(theme.palette.primary.contrastText, 0.2) : '#222',
        border: isSelected ? `2px solid ${theme.palette.primary.light}` : `1px solid #000`,
        mb: 1,
      }}
    >
      <ListItemText
        sx={{
          flex: '1 1 70%',
        }}
        primary={
          <Box>
            <Typography variant="body1" sx={{ color: theme.palette.primary.main }}>
              {compact ? storeChoice.name_short : storeChoice.name}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.secondary.main }}>
              {lookups.planetLookups['ST'][storeChoice.planet].name}
              {storeChoice.satellite &&
                ` // ${lookups.planetLookups['ST'][storeChoice.planet].satellites[storeChoice.satellite]}`}
            </Typography>
          </Box>
        }
        secondary={
          <Box>
            {Object.keys(ores).map((ore, index) => {
              const found = !storeChoice.missingOres.find((missingOre) => missingOre === ore)
              return (
                <Tooltip
                  title={
                    found
                      ? `${getOreName(ore as AnyOreEnum)} can be sold here}`
                      : `${getOreName(ore as AnyOreEnum)} cannot be sold here}`
                  }
                >
                  <Chip
                    key={index}
                    label={compact ? getOreName(ore as AnyOreEnum).slice(0, 4) : getOreName(ore as AnyOreEnum)}
                    size="small"
                    sx={{
                      ...styles.tinyChips,
                      background: found ? theme.palette.primary.main : theme.palette.primary.contrastText,
                      color: found ? theme.palette.primary.contrastText : theme.palette.primary.dark,
                    }}
                  />
                </Tooltip>
              )
            })}
          </Box>
        }
      />
      <ListItemText
        sx={{
          flex: '1 1 30%',
          display: 'flex',
          flexDirection: 'column',
          '& .MuiListItemText-primary': {
            flexGrow: 1,
            color: priceColor || theme.palette.success.main,
            fontSize: '1.2rem',
            textAlign: 'right',
            fontFamily: fontFamilies.robotoMono,
          },
          '& .MuiListItemText-secondary': {
            flexGrow: 0,
            textAlign: 'right',
          },
        }}
        primary={MValueFormatter(storeChoice.price, MValueFormat.currency_sm, 1)}
        secondary={
          <Stack direction={'column'}>
            <div style={{ flexGrow: 1 }} />
            {isMax && (
              <Chip
                label="Max"
                sx={{
                  ...styles.tinyChips,
                  flexGrow: 0,
                  color: theme.palette.success.contrastText,
                  background: theme.palette.success.main,
                }}
              />
            )}
            {isSelected && (
              <Chip
                label="Current"
                sx={{
                  ...styles.tinyChips,
                  flexGrow: 0,
                  color: theme.palette.primary.contrastText,
                  background: theme.palette.primary.main,
                }}
              />
            )}
          </Stack>
        }
      />
    </ListItemButton>
  )
}
