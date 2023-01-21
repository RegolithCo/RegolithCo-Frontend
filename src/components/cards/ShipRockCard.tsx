import * as React from 'react'
import {
  Typography,
  Card,
  List,
  ListItem,
  Box,
  CardContent,
  Stack,
  useTheme,
  SxProps,
  Theme,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import { ShipOreEnum, ShipRock, getShipOreName, RockStateEnum } from '@regolithco/common'
import { MValueFormat, MValueFormatter } from '../fields/MValue'
import { Scale } from '@mui/icons-material'
import { fontFamilies } from '../../theme'

export interface ShipRockCardProps {
  rock: ShipRock
  rockValue?: number
  onChangeState?: (state: RockStateEnum) => void
  onEditClick?: () => void
}

const stylesThunk = (theme: Theme, rockState: RockStateEnum): Record<string, SxProps<Theme>> => {
  let accentColor = theme.palette.primary.light
  let contrastColor = theme.palette.primary.contrastText
  switch (rockState) {
    case RockStateEnum.Ready:
      accentColor = theme.palette.primary.light
      contrastColor = theme.palette.primary.contrastText
      break
    case RockStateEnum.Depleted:
      accentColor = theme.palette.grey[500]
      contrastColor = theme.palette.grey[900]
      break
  }
  return {
    card: {
      position: 'relative',
      overflow: 'hidden',
      opacity: rockState === RockStateEnum.Depleted ? 0.5 : 1,
      border: `1px solid ${accentColor}`,
      '& .MuiListItem-root': {
        flexGrow: 1,
        overflow: 'hidden',
        px: 0.5,
        '& .MuiTypography-root': {
          fontSize: 8,
          fontFamily: fontFamilies.robotoMono,
          fontWeight: 'bold',
        },
      },
      '& .MuiTypography-root': {
        fontSize: 10,
      },
      width: 90,
      height: 100,
    },
    cardContent: {
      height: '100%',
      overflow: 'hidden',
      fontSize: 10,
      p: 0,
      '&:last-child': {
        p: 0,
      },
      display: 'flex',
      flexDirection: 'column',
      color: contrastColor,
    },
    topBox: {
      color: contrastColor,
      background: accentColor,
    },
    oreList: {
      p: 0,
      height: '100%',
      flexGrow: 1,
      overflow: 'hidden',
    },
    oreName: {
      color: theme.palette.text.primary,
      flex: '1 1 60%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    orePercent: {
      textAlign: 'right',
      flex: '1 1',
      color: theme.palette.text.secondary,
    },
    depletedMark: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) rotate(-45deg)',
      zIndex: 1000,
      opacity: 0.3,
      border: `2px solid ${accentColor}`,
      borderRadius: 2,
      color: accentColor,
    },
    stateCheckbox: {
      p: 0,
      borderTop: `1px solid ${accentColor}`,
      '&.MuiFormGroup-root': {
        m: 0,
        p: 0,
      },
      '& .MuiFormControlLabel-root': {
        m: 0,
        p: 0,
      },
      '& .MuiTypography-root': {
        color: accentColor,
      },
      '& .MuiButtonBase-root': {
        p: 0,
      },
      '&, &.Mui-selected, & .Mui-checked': {
        color: accentColor,
        // backgroundColor: theme.palette.primary.main,
      },
    },
  }
}

/**
 * This is the wrpaper for all the types of things scouts can find
 * @param param0
 * @returns
 */
export const ShipRockCard: React.FC<ShipRockCardProps> = ({ rock, rockValue, onChangeState, onEditClick }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme, rock.state)

  return (
    <Card sx={styles.card}>
      {rock.state === RockStateEnum.Depleted && <Box sx={styles.depletedMark}>DEPLETED</Box>}
      <CardContent sx={styles.cardContent}>
        <Box sx={{ ...styles.topBox, cursor: onEditClick ? 'pointer' : 'default' }} onClick={onEditClick}>
          <Stack direction="row" alignItems="center" sx={{ p: 0.5 }}>
            <Scale sx={{ height: 12, width: 12, pr: 0.5 }} />
            <Typography>{MValueFormatter(rock.mass, MValueFormat.number_sm, 1)}</Typography>
            <div style={{ flex: '1 1' }} />
            <Typography>
              {rockValue ? MValueFormatter(rockValue, MValueFormat.number_sm) : '??'}
              <span style={{ fontSize: 6 }}>aUEC</span>
            </Typography>
          </Stack>
        </Box>

        <List dense sx={{ ...styles.oreList, cursor: onEditClick ? 'pointer' : 'default' }} onClick={onEditClick}>
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
                  <Typography component="div" sx={styles.oreName}>
                    {getShipOreName(ore as ShipOreEnum)}
                  </Typography>
                  <Typography component="div" sx={styles.orePercent}>
                    {percent ? MValueFormatter(percent, MValueFormat.percent, 0) : '??%'}
                  </Typography>
                </ListItem>
              ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <FormGroup sx={styles.stateCheckbox}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={rock.state === RockStateEnum.Depleted}
                onChange={(e) =>
                  onChangeState && onChangeState(e.target.checked ? RockStateEnum.Depleted : RockStateEnum.Ready)
                }
              />
            }
            label="Depleted"
          />
        </FormGroup>
      </CardContent>
    </Card>
  )
}
