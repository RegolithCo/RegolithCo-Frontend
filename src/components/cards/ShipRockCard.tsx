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
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material'
import { ShipOreEnum, ShipRock, getShipOreName, RockStateEnum } from '@regolithco/common'
import { MValueFormat, MValueFormatter } from '../fields/MValue'
import { fontFamilies } from '../../theme'
import { RockIcon } from '../../icons'

export interface ShipRockCardProps {
  rock: ShipRock
  rockValue?: number
  allowEdit?: boolean
  onChangeState?: (state: RockStateEnum) => void
  onEditClick?: () => void
}

const stylesThunk = (theme: Theme, rockState: RockStateEnum): Record<string, SxProps<Theme>> => {
  let accentColor = theme.palette.primary.main
  let contrastColor = theme.palette.primary.contrastText
  switch (rockState) {
    case RockStateEnum.Ready:
      accentColor = theme.palette.primary.main
      contrastColor = theme.palette.primary.contrastText
      break
    case RockStateEnum.Ignore:
      accentColor = theme.palette.grey[500]
      contrastColor = theme.palette.grey[900]
      break
    case RockStateEnum.Depleted:
      accentColor = theme.palette.grey[500]
      contrastColor = theme.palette.grey[900]
      break
  }
  return {
    card: {
      width: '100%',
      height: '100%',
      minHeight: '140px',
      position: 'relative',
      overflow: 'hidden',
      opacity: rockState !== RockStateEnum.Ready ? 0.5 : 1,
      border: `1px solid ${accentColor}`,
      '& .MuiListItem-root': {
        flexGrow: 1,
        overflow: 'hidden',
        px: 0.5,
        '& .MuiTypography-root': {
          // fontSize: 8,
          fontFamily: fontFamilies.robotoMono,
          fontWeight: 'bold',
        },
      },
      '& .MuiTypography-root': {
        // fontSize: 10,
      },
    },
    cardContent: {
      height: '100%',
      overflow: 'hidden',
      // fontSize: 10,
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
      '& .MuiListItem-root .MuiTypography-root': {
        fontSize: '0.8em',
        p: 0.2,
        fontFamily: fontFamilies.robotoMono,
        fontWeight: 'bold',
      },
    },
    massNum: {
      fontFamily: fontFamilies.robotoMono,
      fontWeight: 'bold',
    },
    valueNum: {
      display: 'inline',
      fontSize: '0.7em',
      fontFamily: fontFamilies.robotoMono,
      fontWeight: 'bold',
    },
    oreName: {
      color: theme.palette.text.secondary,
      flex: '1 1 60%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    orePercent: {
      textAlign: 'right',
      flex: '1 1',
      color: theme.palette.text.primary,
    },
    currency: {
      display: 'inline',
      fontSize: '0.8em',
      fontStyle: 'italic',
    },
    depletedMark: {
      position: 'absolute',
      pointerEvents: 'none',
      top: '50%',
      left: '50%',
      fontSize: 30,
      transform: 'translate(-50%, -50%) rotate(-38deg)',
      zIndex: 1000,
      opacity: 0.4,
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
export const ShipRockCard: React.FC<ShipRockCardProps> = ({
  rock,
  rockValue,
  onChangeState,
  onEditClick,
  allowEdit,
}) => {
  const theme = useTheme()
  const styles = stylesThunk(theme, rock.state)
  const onClickAction = allowEdit ? onEditClick : undefined
  const cursor = onClickAction ? 'pointer' : 'default'

  return (
    <Card sx={{ ...styles.card, '& *': { cursor } }}>
      {rock.state === RockStateEnum.Depleted && <Box sx={styles.depletedMark}>DONE</Box>}
      {rock.state === RockStateEnum.Ignore && <Box sx={styles.depletedMark}>IGNORE</Box>}
      <CardContent sx={styles.cardContent}>
        <RockIcon
          onClick={onClickAction}
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 60,
            color: '#f0f0f012',
          }}
        />
        <Box sx={{ ...styles.topBox, cursor }} onClick={onClickAction}>
          <Stack direction="row" alignItems="center" sx={{ p: 0.5 }}>
            <Typography sx={styles.massNum}>{MValueFormatter(rock.mass, MValueFormat.number_sm, 1)}</Typography>
            <div style={{ flex: '1 1' }} />
            <Typography sx={styles.valueNum} component="div">
              {rockValue ? MValueFormatter(rockValue, MValueFormat.currency_sm) : '??'}
            </Typography>
          </Stack>
        </Box>

        <List dense sx={{ ...styles.oreList, cursor: onClickAction ? 'pointer' : 'default' }} onClick={onClickAction}>
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
        {allowEdit && (
          <ToggleButtonGroup
            size="small"
            value={rock.state}
            exclusive
            onChange={(e, newRockState: RockStateEnum) => {
              if (!onChangeState) return
              if (!newRockState && rock.state !== RockStateEnum.Ready) return onChangeState(RockStateEnum.Ready)
              else if (rock.state !== newRockState) return onChangeState(newRockState)
            }}
          >
            <ToggleButton
              value={RockStateEnum.Depleted}
              color={rock.state === RockStateEnum.Ignore ? 'primary' : undefined}
            >
              Done
            </ToggleButton>
            <ToggleButton
              value={RockStateEnum.Ignore}
              color={rock.state === RockStateEnum.Ignore ? 'primary' : undefined}
            >
              Ignore
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      </CardContent>
    </Card>
  )
}
