import React from 'react'
import { Box, ToggleButton, ToggleButtonGroup, Typography, useTheme } from '@mui/material'
import { ActivityEnum } from '@regolithco/common'
import { ClawIcon, GemIcon, RockIcon } from '../../icons'
import { AccountBalance } from '@mui/icons-material'

export interface WorkOrderTypeChooserProps {
  value?: ActivityEnum
  onChange?: (value: ActivityEnum) => void
  hideOther?: boolean
  allowNone?: boolean
}

export const WorkOrderTypeChooser: React.FC<WorkOrderTypeChooserProps> = ({
  onChange,
  value,
  hideOther,
  allowNone,
}) => {
  const theme = useTheme()

  const rows: any[] = [
    {
      icon: <RockIcon />,
      title: 'Ship mining',
      description: (
        <>
          'Quantanium, Laranite, Taranite... <br />
          Includes refinery calculator.'
        </>
      ),
      value: ActivityEnum.ShipMining,
    },
    {
      icon: <GemIcon />,
      title: 'ROC / Hand',
      description: 'Hadanite, Aphorite, Dolivine, Janalite....',
      value: ActivityEnum.VehicleMining,
    },
    {
      icon: <ClawIcon />,
      title: 'Salvage',
      description: 'For collecting and selling RMC.',
      value: ActivityEnum.Salvage,
    },
  ]
  if (!hideOther) {
    rows.push({
      icon: <AccountBalance />,
      title: 'Share aUEC',
      description: 'Arbitrarily divide some funds between members',
      value: ActivityEnum.Other,
    })
  }

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
          border: `1px solid ${theme.palette.primary.main}`,
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
