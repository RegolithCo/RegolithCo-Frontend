import React from 'react'
import { Box, ToggleButton, ToggleButtonGroup, Typography, useTheme } from '@mui/material'
import { ScoutingFindTypeEnum } from '@regolithco/common'
import { ClawIcon, GemIcon, RockIcon } from '../../icons'

export interface ScoutingFindTypeChooserProps {
  value?: ScoutingFindTypeEnum
  onChange?: (value: ScoutingFindTypeEnum) => void
  hideOther?: boolean
  allowNone?: boolean
}

export const ScoutingFindTypeChooser: React.FC<ScoutingFindTypeChooserProps> = ({ onChange, value, allowNone }) => {
  const theme = useTheme()

  const rows: any[] = [
    {
      icon: <RockIcon />,
      title: 'Ship',
      description: (
        <>
          'Quantanium, Laranite, Taranite... <br />
          Includes refinery calculator.'
        </>
      ),
      value: ScoutingFindTypeEnum.Ship,
    },
    {
      icon: <GemIcon />,
      title: 'ROC / Hand',
      description: 'Hadanite, Aphorite, Dolivine....',
      value: ScoutingFindTypeEnum.Vehicle,
    },
    {
      icon: <ClawIcon />,
      title: 'Salvage',
      description: 'For collecting and selling RMC.',
      value: ScoutingFindTypeEnum.Salvage,
    },
  ]

  return (
    <ToggleButtonGroup
      value={value}
      size="small"
      fullWidth
      exclusive
      sx={{
        '& .MuiToggleButton-root.Mui-selected': {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          border: `1px solid ${theme.palette.primary.light}`,
          boxShadow: `0px 0px 10px 5px ${theme.palette.secondary.light}`,
        },
        '& .MuiToggleButton-root.Mui-selected:hover': {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          border: `1px solid ${theme.palette.primary.main}`,
          boxShadow: `0px 0px 15px 5px ${theme.palette.secondary.light}`,
        },
      }}
      onChange={(e, newVal) => {
        if (allowNone || newVal) {
          onChange && onChange(newVal)
        }
      }}
    >
      {rows.map((row, idx) => {
        return (
          <ToggleButton
            key={row.value}
            selected={value === row.value}
            value={row.value}
            size="small"
            fullWidth
            sx={{ flexDirection: 'column' }}
          >
            {row.icon}
            <Box
              sx={{
                flex: '1 1',
                mt: 2,
                [theme.breakpoints.down('sm')]: {
                  mt: 1,
                  p: 0.2,
                  '& .MuiTypography-root': {
                    fontSize: '0.7rem',
                  },
                },
              }}
            >
              <Typography component="div">{row.title}</Typography>
            </Box>
          </ToggleButton>
        )
      })}
    </ToggleButtonGroup>
  )
}
