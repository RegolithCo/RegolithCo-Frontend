import * as React from 'react'

import {
  Box,
  Chip,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  SxProps,
  Theme,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { AnyOreEnum, OreSummary, StoreChoice, getOreName, Lookups } from '@regolithco/common'
import { MValueFormat } from '../fields/MValue'
import { MValueFormatter } from '../fields/MValue'
import { fontFamilies } from '../../theme'
import { alpha } from '@mui/material'
import { LookupsContext } from '../../context/lookupsContext'

export interface StoreChooserListItemProps {
  cityStores: StoreChoice
  ores: OreSummary
  onClick: (storeChoice: StoreChoice) => void
  compact?: boolean
  disabled?: boolean
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
  cityStores,
  priceColor,
  onClick,
  disabled,
  compact,
  isSelected,
  isMax,
}) => {
  const theme = useTheme()
  const styles = styleThunk(theme)
  const dataStore = React.useContext(LookupsContext)

  if (!dataStore.ready) return null
  const planetLookups = React.useMemo(
    () => dataStore.getLookup('planetLookups') as Lookups['planetLookups'],
    [dataStore]
  )
  const oreKeys = Object.keys(ores)
  const oreSecondaries = React.useMemo(() => {
    return Object.keys(ores).map((ore, index) => {
      const found = !cityStores.missingOres.includes(ore as AnyOreEnum)
      const oreName = getOreName(ore as AnyOreEnum)
      return (
        <Tooltip key={`tt-${index}`} title={found ? `${oreName} can be sold here` : `${oreName} cannot be sold here`}>
          <Chip
            key={index}
            label={compact ? oreName.slice(0, 4) : oreName}
            size="small"
            sx={{
              ...styles.tinyChips,
              background: found ? theme.palette.primary.main : theme.palette.primary.contrastText,
              color: found ? theme.palette.primary.contrastText : theme.palette.primary.dark,
            }}
          />
        </Tooltip>
      )
    })
  }, [oreKeys, cityStores.missingOres, compact, styles.tinyChips])

  const price = React.useMemo(() => Object.values(cityStores.prices).reduce((a, b) => a + b, 0), [cityStores.prices])

  // // NO HOOKS BELOW HERE

  const planetName =
    cityStores && cityStores.planet
      ? planetLookups['ST'] && planetLookups['ST'][cityStores.planet] && planetLookups['ST'][cityStores.planet].name
      : ''
  const satellite =
    cityStores && cityStores.satellite
      ? planetLookups['ST'][cityStores.planet]?.satellites[cityStores.satellite]
      : undefined
  const city = cityStores.city || ''
  // Price is the sum of all the prices

  const contents = (
    <>
      <ListItemText
        sx={{
          flex: '1 1 65%',
        }}
        primary={
          <Box>
            <Typography variant="body1" sx={{ color: theme.palette.primary.main }} component="div">
              {compact ? cityStores.name_short : cityStores.name}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.secondary.main }} component="div">
              {planetName}
              {satellite && ` // ${satellite}${city ? ' // ' + city : ''}`}
            </Typography>
          </Box>
        }
        secondaryTypographyProps={{
          component: 'div',
        }}
        secondary={!compact && <Box>{oreSecondaries}</Box>}
      />
      <ListItemText
        sx={{
          flex: '1 1 35%',
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
        primary={
          <Tooltip title={MValueFormatter(price, MValueFormat.currency)}>
            <span>{MValueFormatter(price, MValueFormat.currency_sm)}</span>
          </Tooltip>
        }
        secondaryTypographyProps={{
          component: 'div',
        }}
        secondary={
          <Stack direction={'row'} spacing={1} alignItems="center" justifyContent="flex-end">
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
    </>
  )
  const itemSx = {
    borderRadius: 3,
    // background: '#222',
    boxShadow: isSelected ? `0 0 10px 2px ${theme.palette.primary.light}` : 'none',
    background: isSelected ? alpha(theme.palette.primary.contrastText, 0.2) : '#222',
    border: isSelected ? `2px solid ${theme.palette.primary.light}` : `1px solid #000`,
    mb: 1,
  }

  return disabled ? (
    <ListItem sx={itemSx}>{contents}</ListItem>
  ) : (
    <ListItemButton sx={itemSx} onClick={() => onClick && onClick(cityStores)}>
      {contents}
    </ListItemButton>
  )
}
