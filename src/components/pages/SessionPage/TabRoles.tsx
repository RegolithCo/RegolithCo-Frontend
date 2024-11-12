import * as React from 'react'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import { DestructuredSettings, Session, SessionInput, SessionSettings, UserSuggest } from '@regolithco/common'
import { DialogEnum } from '../../../context/session.context'

export interface RolesTabProps {
  // Use this for the session version
  session?: Session
  scroll?: boolean
  // For the profile version we only have the sessionSettings
  sessionSettings?: SessionSettings
  onChangeSession?: (session: SessionInput, newSettings: DestructuredSettings) => void
  onChangeSettings?: (newSettings: DestructuredSettings) => void
  setActiveModal?: (modal: DialogEnum) => void
  userSuggest?: UserSuggest
}

export const RolesTab: React.FC<RolesTabProps> = ({
  session,
  sessionSettings,
  userSuggest,
  scroll,
  onChangeSession,
  onChangeSettings,
  setActiveModal,
}) => {
  const theme = useTheme()
  const mediumUp = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <Box
      sx={
        {
          //
        }
      }
    >
      {/* Here's our scrollbox */}
      <Box
        sx={
          {
            //
          }
        }
      >
        hello
      </Box>
    </Box>
  )
}
