import * as React from 'react'

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Link,
  List,
  SxProps,
  Theme,
  Typography,
  useTheme,
} from '@mui/material'
import { OreSummary, findAllStoreChoices, StoreChoice, SystemEnum } from '@regolithco/common'
import { Stack } from '@mui/system'
import Gradient from 'javascript-color-gradient'
import { Cancel, ResetTv } from '@mui/icons-material'
import { StoreChooserListItem } from '../fields/StoreChooserListItem'
import { LookupsContext } from '../../context/lookupsContext'

export interface StoreChooserModalProps {
  open?: boolean
  ores: OreSummary
  initStore?: string
  systemFilter?: SystemEnum | null
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
      outline: `3px solid ${theme.palette.primary.contrastText}`,
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
    px: 2,
    py: 1,
  },
})

export const StoreChooserModal: React.FC<StoreChooserModalProps> = ({
  open,
  ores,
  initStore,
  isRefined,
  systemFilter,
  onClose,
  onSubmit,
}) => {
  const theme = useTheme()
  const styles = styleThunk(theme)
  const [storeChoices, setStoreChoices] = React.useState<StoreChoice[]>([])

  const dataStore = React.useContext(LookupsContext)
  if (!dataStore.ready) return null

  React.useEffect(() => {
    if (!dataStore.ready) return
    const calcStoreChoices = async () => {
      const storeChoices = await findAllStoreChoices(dataStore, ores, isRefined)
      console.log('MARZIPAN', storeChoices)
      setStoreChoices(storeChoices.filter((store) => !systemFilter || store.system === systemFilter))
    }
    calcStoreChoices()
  }, [dataStore.ready, ores, isRefined, systemFilter])

  const quaColors = [theme.palette.success.light, theme.palette.warning.light, theme.palette.error.light]

  // setMidpoint should be a number greater than or equal to the number of colors
  const mindPoint = storeChoices && storeChoices.length > quaColors.length ? storeChoices.length : quaColors.length
  const bgColors = new Gradient()
    .setColorGradient(...quaColors)
    .setMidpoint(mindPoint) // 100 is the number of colors to generate. Should be enough stops for our ores
    .getColors()

  return (
    <>
      <Dialog
        open={Boolean(open)}
        onClose={onClose}
        sx={styles.paper}
        maxWidth="sm"
        fullWidth
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: 'blur(3px)',
            },
          },
        }}
      >
        <Box sx={styles.headerBar}>
          <Stack direction="row">
            <Typography variant="h6" sx={styles.cardTitle}>
              Sell Location Chooser
            </Typography>
            <div style={{ flex: 1 }} />
            <Typography variant="caption" sx={styles.cardTitle}>
              Price for all sellable ores
            </Typography>
          </Stack>
          <Box>
            <Typography variant="caption" sx={styles.cardTitle} component="div">
              Prices courtesy of:{' '}
              <Link href="https://uexcorp.space/" target="_blank" color={theme.palette.primary.contrastText}>
                UEX
              </Link>
            </Typography>
          </Box>
        </Box>
        <DialogContent sx={styles.dialogContent}>
          {storeChoices.length === 0 && (
            <Typography variant="body2" sx={{ color: theme.palette.secondary.light }}>
              No stores found
            </Typography>
          )}
          <List sx={{ overflowY: 'scroll', flexGrow: 1, px: 2 }}>
            {storeChoices.map((choice, index) => (
              <StoreChooserListItem
                key={`store-${index}`}
                ores={ores}
                isSelected={choice.code === initStore}
                cityStores={choice}
                priceColor={bgColors[index]}
                isMax={index === 0}
                onClick={() => {
                  onSubmit && onSubmit(choice.code)
                  onClose()
                }}
              />
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
                onSubmit && onSubmit(null)
                onClose()
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
