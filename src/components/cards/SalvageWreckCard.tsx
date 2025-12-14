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
  Tooltip,
} from '@mui/material'
import { WreckStateEnum, SalvageWreck, ShipLookups } from '@regolithco/common'
import { MValueFormat, MValueFormatter } from '../fields/MValue'
import { fontFamilies } from '../../theme'
import { ClawIcon } from '../../icons'
import { LookupsContext } from '../../context/lookupsContext'

export interface SalvageWreckCardProps {
  wreck: SalvageWreck
  wreckValue?: number | bigint
  allowEdit?: boolean
  onChangeState?: (state: WreckStateEnum) => void
  onEditClick?: () => void
}

const stylesThunk = (theme: Theme, rockState: WreckStateEnum): Record<string, SxProps<Theme>> => {
  let accentColor = theme.palette.primary.main
  let contrastColor = theme.palette.primary.contrastText
  switch (rockState) {
    case WreckStateEnum.Ready:
      accentColor = theme.palette.primary.main
      contrastColor = theme.palette.primary.contrastText
      break
    case WreckStateEnum.Ignore:
      accentColor = theme.palette.grey[500]
      contrastColor = theme.palette.grey[900]
      break
    case WreckStateEnum.Depleted:
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
      opacity: rockState !== WreckStateEnum.Ready ? 0.5 : 1,
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
    shipName: {
      fontFamily: fontFamilies.robotoMono,
      fontWeight: 'bold',
      // truncate with ellipses
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    valueNum: {
      display: 'inline',
      fontSize: '0.7em',
      fontFamily: fontFamilies.robotoMono,
      fontWeight: 'bold',
    },
    oreName: {
      color: theme.palette.text.secondary,
      flex: '1 1 45%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    orePercent: {
      textAlign: 'right',
      flex: '1 1 50%',
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
export const SalvageWreckCard: React.FC<SalvageWreckCardProps> = ({
  wreck,
  wreckValue,
  onChangeState,
  onEditClick,
  allowEdit,
}) => {
  const theme = useTheme()
  const dataStore = React.useContext(LookupsContext)
  const [shipName, setShipName] = React.useState<string | undefined>(undefined)
  const styles = stylesThunk(theme, wreck.state)
  const onClickAction = allowEdit ? onEditClick : undefined
  const cursor = onClickAction ? 'pointer' : 'default'

  React.useEffect(() => {
    if (!dataStore.ready || !wreck || !wreck.shipCode) return
    const shipLookups = dataStore.getLookup('shipLookups') as ShipLookups
    const getShipName = async () => {
      const ship = shipLookups.find((s) => s.UEXID === wreck.shipCode)
      if (ship) {
        setShipName(ship.name)
      }
    }
    getShipName()
  }, [dataStore, wreck])

  return (
    <Card sx={{ ...styles.card, '& *': { cursor } }}>
      {wreck.state === WreckStateEnum.Depleted && <Box sx={styles.depletedMark}>DONE</Box>}
      {wreck.state === WreckStateEnum.Ignore && <Box sx={styles.depletedMark}>IGNORE</Box>}
      <CardContent sx={styles.cardContent}>
        <ClawIcon
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
            <Typography sx={styles.shipName}>{wreck.isShip ? (shipName ? shipName : 'Ship') : 'Panel'}</Typography>
            <div style={{ flex: '1 1' }} />
            <Typography sx={styles.valueNum} component="div">
              {wreckValue ? MValueFormatter(wreckValue, MValueFormat.currency_sm) : '??'}
            </Typography>
          </Stack>
        </Box>

        <List dense sx={{ ...styles.oreList, cursor: onClickAction ? 'pointer' : 'default' }} onClick={onClickAction}>
          {wreck.salvageOres &&
            wreck.salvageOres
              .filter((ore) => ore.scu && ore.scu > 0)
              .map(({ ore, scu }, idx) => (
                <ListItem
                  disableGutters
                  disablePadding
                  key={ore}
                  sx={{ backgroundColor: idx % 2 === 0 ? '#000000aa' : 'transparent' }}
                >
                  <Typography component="div" sx={styles.oreName}>
                    {ore}
                  </Typography>
                  <Typography component="div" sx={styles.orePercent}>
                    {MValueFormatter(scu || 0, MValueFormat.volSCU, 0)}
                  </Typography>
                </ListItem>
              ))}
          {wreck.sellableAUEC && (
            <ListItem
              disableGutters
              disablePadding
              sx={{ backgroundColor: (wreck.salvageOres.length + 1) % 2 === 0 ? '#000000aa' : 'transparent' }}
            >
              <Tooltip title="Cargo & Components" placement="right">
                <Typography component="div" sx={styles.oreName}>
                  CGO & CMP
                </Typography>
              </Tooltip>
              <Typography component="div" sx={styles.orePercent}>
                {MValueFormatter(wreck.sellableAUEC, MValueFormat.currency_sm, 0)}
              </Typography>
            </ListItem>
          )}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        {allowEdit && (
          <ToggleButtonGroup
            size="small"
            value={wreck.state}
            exclusive
            onChange={(e, newRockState: WreckStateEnum) => {
              if (!onChangeState) return
              if (!newRockState && wreck.state !== WreckStateEnum.Ready) return onChangeState(WreckStateEnum.Ready)
              else if (wreck.state !== newRockState) return onChangeState(newRockState)
            }}
          >
            <ToggleButton
              value={WreckStateEnum.Depleted}
              color={wreck.state === WreckStateEnum.Ignore ? 'primary' : undefined}
            >
              Done
            </ToggleButton>
            <ToggleButton
              value={WreckStateEnum.Ignore}
              color={wreck.state === WreckStateEnum.Ignore ? 'primary' : undefined}
            >
              Ignore
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      </CardContent>
    </Card>
  )
}
