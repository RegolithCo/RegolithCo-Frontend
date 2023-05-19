import * as React from 'react'

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  List,
  ListItemButton,
  ListItemText,
  SxProps,
  Theme,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { OreSummary, findAllStoreChoices, lookups } from '@regolithco/common'
import { Stack } from '@mui/system'
import Gradient from 'javascript-color-gradient'
import { Cancel, Error, ResetTv } from '@mui/icons-material'
import { MValueFormat } from '../fields/MValue'
import { MValueFormatter } from '../fields/MValue'
import { fontFamilies } from '../../theme'

export const SHIP_ROCK_BOUNDS = [2000, 150000]

export interface StoreChooserModalProps {
  open?: boolean
  ores: OreSummary
  initStore?: string
  isRefined?: boolean
  onClose: () => void
  onSubmit?: (storeCode: string | null) => void
}

const styleThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  paper: {
    '& .MuiDialog-paper': {
      [theme.breakpoints.up('md')]: {
        minHeight: 550,
        maxHeight: 900,
        overflow: 'visible',
      },
      backgroundColor: '#282828ee',
      backgroundImage: 'none',
      borderRadius: 4,
      position: 'relative',
      outline: `10px solid ${theme.palette.primary.contrastText}`,
      border: `10px solid ${theme.palette.primary.main}`,
      maxHeight: 300,
    },
  },
  dialogContent: {
    py: 1,
    px: 2,
    borderRadius: 3,
    outline: `10px solid ${theme.palette.primary.main}`,
    flexDirection: 'column',
    display: 'flex',
  },
  headTitles: {
    fontWeight: 'bold',
    fontSize: '0.8rem',
  },
  headerBar: {
    color: theme.palette.primary.contrastText,
    background: theme.palette.primary.main,
    display: 'flex',
    justifyContent: 'space-between',
    px: 2,
    py: 1,
  },
})

export const StoreChooserModal: React.FC<StoreChooserModalProps> = ({
  open,
  ores,
  initStore,
  isRefined,
  onClose,
  onSubmit,
}) => {
  const theme = useTheme()
  const styles = styleThunk(theme)

  const storeChoices = findAllStoreChoices(ores, isRefined)
  const quaColors = ['#00ff22', '#fff700', '#FF0000']
  const bgColors = new Gradient()
    .setColorGradient(...quaColors)
    .setMidpoint(storeChoices.length) // 100 is the number of colors to generate. Should be enough stops for our ores
    .getColors()
  // Sort the storeChoices array in descending order of price
  const sortedStoreChoices = [...storeChoices].sort((a, b) => b.price - a.price)

  return (
    <>
      <Dialog open={Boolean(open)} onClose={onClose} sx={styles.paper} maxWidth="sm" fullWidth>
        <Box sx={styles.headerBar}>
          <Typography variant="h6" sx={styles.cardTitle} component="div">
            Store Chooser
          </Typography>
          <Typography variant="caption" sx={styles.cardTitle} component="div">
            Price for all sellable ores
          </Typography>
        </Box>
        <DialogContent sx={styles.dialogContent}>
          {storeChoices.length === 0 && (
            <Typography variant="body2" sx={{ color: theme.palette.secondary.light }}>
              No stores found
            </Typography>
          )}
          <List sx={{ overflowY: 'scroll', flexGrow: 1 }}>
            {sortedStoreChoices.map((choice, index) => (
              <ListItemButton
                key={index}
                onClick={() => {
                  onSubmit && onSubmit(choice.code)
                  onClose()
                }}
                sx={{
                  borderRadius: 3,
                  backgroundOpacity: 0.2,
                  border: `1px solid ${theme.palette.text.secondary}`,
                  mb: 1,
                }}
              >
                <ListItemText
                  sx={{
                    flex: '1 1 70%',
                  }}
                  primary={
                    <Box>
                      <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                        {choice.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        {lookups.planetLookups['ST'][choice.planet].name}
                        {choice.satellite &&
                          ` // ${lookups.planetLookups['ST'][choice.planet].satellites[choice.satellite]}`}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Tooltip
                      title={
                        <Box>
                          <Typography variant="body1" sx={{}} component="div">
                            These ores are not available to sell at this location. You'll need to make a second stop to
                            sell them.
                          </Typography>
                        </Box>
                      }
                    >
                      <Box>
                        {Object.keys(ores).map((ore, index) => {
                          const found = !choice.missingOres.find((missingOre) => missingOre === ore)
                          return (
                            <Chip
                              key={index}
                              label={ore}
                              size="small"
                              sx={{
                                //
                                fontSize: '0.7rem',
                                mr: 0.5,
                                background: found ? theme.palette.success.main : theme.palette.error.light,
                                color: found ? theme.palette.success.contrastText : theme.palette.error.dark,
                                height: 14,
                                borderRadius: 1,
                                fontWeight: 'bold',
                              }}
                            />
                          )
                        })}
                      </Box>
                    </Tooltip>
                  }
                />
                <ListItemText
                  sx={{
                    flex: '1 1 30%',
                    '& .MuiListItemText-primary': {
                      color: bgColors[index],
                      fontSize: '1.2rem',
                      textAlign: 'right',
                      fontFamily: fontFamilies.robotoMono,
                    },
                    '& .MuiListItemText-secondary': {
                      textAlign: 'right',
                    },
                  }}
                  primary={MValueFormatter(choice.price, MValueFormat.currency_sm, 1)}
                  secondary={index === 0 && <Chip label="MAX" color="success" size="small" />}
                />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ background: theme.palette.primary.main }}>
          <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
            <Button color="error" onClick={onClose} variant="contained" startIcon={<Cancel />}>
              Cancel
            </Button>
            <div style={{ flex: 1 }} />
            <Button
              color="secondary"
              startIcon={<ResetTv />}
              size="small"
              variant={'contained'}
              onClick={() => {
                //
              }}
            >
              Auto Choose Max
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  )
}
