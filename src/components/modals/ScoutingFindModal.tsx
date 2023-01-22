import * as React from 'react'
import { Box, Dialog, ThemeProvider } from '@mui/material'

import { ScoutingFind, ScoutingFindStateEnum, SessionUser } from '@regolithco/common'
import { ScoutingFindCalc } from '../calculators/ScoutingFindCalc'
import { scoutingFindStateThemes } from '../../theme'
import { omit } from 'lodash'

export interface ScoutingFindModalProps {
  open: boolean
  scoutingFind: ScoutingFind
  meUser: SessionUser
  onChange: (scoutingFind: ScoutingFind) => void
  onDelete: () => void
  allowEdit?: boolean
  allowWork?: boolean
  isNew?: boolean
  onClose: () => void
}

export const ScoutingFindModal: React.FC<ScoutingFindModalProps> = ({
  open,
  scoutingFind,
  isNew,
  onChange,
  onDelete,
  meUser,
  allowWork,
  allowEdit,
  onClose,
}) => {
  const theme = scoutingFindStateThemes[scoutingFind.state || ScoutingFindStateEnum.Discovered]

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        disableEscapeKeyDown
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 10,
            border: `8px solid ${theme.palette.primary.dark}`,
          },
        }}
      >
        <Box
          sx={{
            overflow: 'hidden',
            height: '100%',
          }}
        >
          <ScoutingFindCalc
            scoutingFind={scoutingFind}
            isNew={isNew}
            allowEdit={allowEdit}
            allowWork={allowWork}
            me={meUser}
            onChange={onChange}
            onDelete={onDelete}
          />
        </Box>
      </Dialog>
    </ThemeProvider>
  )
}
