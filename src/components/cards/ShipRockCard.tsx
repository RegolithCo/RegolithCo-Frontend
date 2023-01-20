import * as React from 'react'
import { Typography, Card, List, ListItem, Box, CardContent, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { ShipOreEnum, ShipRock, getShipOreName } from '@orgminer/common'
import { MValueFormat, MValueFormatter } from '../fields/MValue'
import { CheckCircle, FlagCircle } from '@mui/icons-material'

export interface ShipRockCardProps {
  rock: ShipRock
  rockValue?: number
}

/**
 * This is the wrpaper for all the types of things scouts can find
 * @param param0
 * @returns
 */
export const ShipRockCard: React.FC<ShipRockCardProps> = ({ rock, rockValue }) => {
  return (
    <Card
      sx={{
        overflow: 'hidden',
        border: '1px solid',
        '& .MuiTypography-root': {
          fontSize: 10,
        },
        width: 90,
        height: 120,
      }}
    >
      <CardContent sx={{ fontSize: 10, p: 0 }}>
        <Box sx={{ display: 'flex', fontSize: 10 }}>
          {/* <RockIcon />
        <IconButton>
          <Delete />
        </IconButton> */}
          <div style={{ flex: '1 1' }} />
          {MValueFormatter(rock.mass, MValueFormat.number_sm)}
          <div style={{ flex: '1 1' }} />
          {rockValue ? MValueFormatter(rockValue, MValueFormat.currency_sm) : '??'}
        </Box>

        <List dense>
          {rock.ores &&
            rock.ores
              .filter(({ ore }) => Boolean(ore) && ore !== ShipOreEnum.Inertmaterial)
              .map(({ ore, percent }, idx) => (
                <ListItem
                  disableGutters
                  disablePadding
                  key={ore}
                  sx={{ backgroundColor: idx % 2 === 0 ? '#000000aa' : 'transparent' }}
                >
                  <Typography component="div" variant="caption" color="text.primary">
                    {getShipOreName(ore as ShipOreEnum)}
                  </Typography>
                  <div style={{ flex: '1 1' }} />
                  <Typography component="div" variant="caption" color="text.secondary">
                    {percent ? MValueFormatter(percent, MValueFormat.percent, 0) : '??%'}
                  </Typography>
                </ListItem>
              ))}
        </List>
        <ToggleButtonGroup
          color="primary"
          value={'web'}
          exclusive
          sx={{ width: '100%', display: 'flex' }}
          size="small"
          onChange={() => {
            console.log('change')
          }}
          aria-label="Platform"
        >
          <ToggleButton value="web" sx={{ flex: '1 1', p: 0.2, '& svg': { height: 15, width: 15 } }}>
            <FlagCircle />
          </ToggleButton>
          <ToggleButton value="android" sx={{ flex: '1 1', p: 0.2, '& svg': { height: 15, width: 15 } }}>
            <CheckCircle />
          </ToggleButton>
        </ToggleButtonGroup>
      </CardContent>
    </Card>
  )
}
