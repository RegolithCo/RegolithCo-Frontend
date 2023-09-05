import React from 'react'
import { Stack } from '@mui/material'
import { getSessionUserStateName, ScoutingFind, SessionUserStateEnum } from '@regolithco/common'
import { Box, Theme, useTheme } from '@mui/system'
import { SessionContext } from '../../../../context/session.context'
import { makeSessionUrls } from '../../../../lib/routingUrls'
import { fontFamilies } from '../../../../theme'

export interface StateChipProps {
  userState?: SessionUserStateEnum
  vehicleName?: string
  scoutingFind?: ScoutingFind
}

export const stateColorsBGThunk = (theme: Theme): Record<SessionUserStateEnum, string> => ({
  [SessionUserStateEnum.Unknown]: '#000000',
  [SessionUserStateEnum.Afk]: '#666666',
  [SessionUserStateEnum.OnSite]: theme.palette.info.main,
  [SessionUserStateEnum.RefineryRun]: theme.palette.secondary.main,
  [SessionUserStateEnum.Scouting]: theme.palette.info.light,
  [SessionUserStateEnum.Travelling]: theme.palette.info.light,
})
export const stateColorsFGThunk = (theme: Theme): Record<SessionUserStateEnum, string> => ({
  [SessionUserStateEnum.Unknown]: '#FFFFFF',
  [SessionUserStateEnum.Afk]: '#000000',
  [SessionUserStateEnum.OnSite]: theme.palette.info.contrastText,
  [SessionUserStateEnum.RefineryRun]: theme.palette.secondary.contrastText,
  [SessionUserStateEnum.Scouting]: theme.palette.info.contrastText,
  [SessionUserStateEnum.Travelling]: theme.palette.info.contrastText,
})

export const StateChip: React.FC<StateChipProps> = ({ userState, scoutingFind, vehicleName }) => {
  const theme = useTheme()
  const colorsBg = stateColorsBGThunk(theme)
  const colorsFg = stateColorsFGThunk(theme)
  const { navigate } = React.useContext(SessionContext)
  const stateObjects = []

  const finalVehicleName = vehicleName && vehicleName.length > 16 ? vehicleName.substring(0, 16) + '...' : vehicleName

  if (userState) {
    if (vehicleName) stateObjects.push(finalVehicleName)
    if (scoutingFind) {
      stateObjects.push(
        <>
          {getSessionUserStateName(userState)}
          {userState === SessionUserStateEnum.OnSite && ' at '}
          {userState === SessionUserStateEnum.Travelling && ' to '}
          {(userState === SessionUserStateEnum.OnSite || userState === SessionUserStateEnum.Travelling) &&
            scoutingFind.scoutingFindId.split('_')[0]}
        </>
      )
    } else if (userState !== SessionUserStateEnum.Unknown) {
      stateObjects.push(getSessionUserStateName(userState))
    }
  }

  if (!vehicleName && (!userState || userState === SessionUserStateEnum.Unknown)) return null
  const finalUserState = userState || SessionUserStateEnum.Unknown
  return (
    <Box
      sx={{
        background: colorsBg[finalUserState],
        color: colorsFg[finalUserState],
        position: 'absolute',
        fontFamily: fontFamilies.robotoMono,
        textTransform: 'uppercase',
        fontSize: '0.6rem',
        fontWeight: 'bold',
        borderRadius: '0 0 0 0.4rem',
        px: 0.5,
        pl: 1,
        top: 0,
        right: 0,
      }}
      onClick={(e) => {
        if (!scoutingFind) return
        e.stopPropagation()
        e.preventDefault()
        navigate &&
          navigate(makeSessionUrls({ sessionId: scoutingFind.sessionId, scoutingFindId: scoutingFind.scoutingFindId }))
      }}
    >
      <Stack direction="row" spacing={1}>
        {stateObjects.map((it, idx) => (
          <Box key={`stat$-${idx}`}>{it}</Box>
        ))}
      </Stack>
    </Box>
  )
}
