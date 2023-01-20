import * as React from 'react'

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
  TextField,
  Typography,
} from '@mui/material'
import { lookups, MarketPriceLookupValue, ShipOreEnum, ShipRock, ShipRockOre } from '@orgminer/common'
import { ShipOreChooser } from '../fields/ShipOreChooser'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'

export interface ShipRockEntryModalProps {
  open: boolean
  shipRock?: ShipRock
  onClose: () => void
  onSubmit: (newRock: ShipRock) => void
}

export const ShipRockEntryModal: React.FC<ShipRockEntryModalProps> = ({ open, shipRock, onClose, onSubmit }) => {
  const [newShipRock, setNewShipRock] = React.useState<ShipRock>(
    shipRock || { mass: 0, ores: [], __typename: 'ShipRock' }
  )

  const ores: ShipRockOre[] = [...(newShipRock.ores || [])]
  // alphabetical sort
  ores.sort(({ ore: a }, { ore: b }) => {
    const aPrice = lookups.marketPriceLookup[a as ShipOreEnum] as MarketPriceLookupValue
    const bPrice = lookups.marketPriceLookup[b as ShipOreEnum] as MarketPriceLookupValue
    return bPrice.refined - aPrice.refined
  })
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          border: '10px solid',
          borderRadius: 8,
          minHeight: 550,
        },
      }}
      maxWidth="xs"
    >
      <DialogTitle>Enter Rock</DialogTitle>
      <DialogContent>
        <Typography variant="overline">Rock size (mass)</Typography>
        <Grid2 container spacing={2} padding={2}>
          <Grid2 xs={9}>
            <Slider
              step={1}
              color="secondary"
              valueLabelDisplay="auto"
              value={newShipRock.mass as number}
              onChange={(event: Event, newValue: number | number[]) => {
                if (typeof newValue === 'number') {
                  setNewShipRock({ ...newShipRock, mass: newValue })
                }
              }}
              marks={marks}
              min={3000}
              max={9000}
            />
          </Grid2>
          <Grid2 xs={3}>
            <TextField
              value={(newShipRock.mass as number).toFixed(0)}
              onChange={(event) => {
                setNewShipRock({ ...newShipRock, mass: Number(event.target.value) })
              }}
              variant="outlined"
              type="number"
              size="small"
            />
          </Grid2>
        </Grid2>
        <Typography variant="overline">Rock Composition</Typography>
        <Box sx={{ mb: 2 }}>
          <ShipOreChooser
            multiple
            values={ores.map((o) => o.ore as ShipOreEnum)}
            onChange={(shipOreEnum) => {
              setNewShipRock({
                ...newShipRock,
                ores: shipOreEnum.map((ore) => {
                  const found = (newShipRock.ores || []).find((o) => o.ore === ore)
                  return found || { ore, percent: 0, __typename: 'ShipRockOre' }
                }),
              })
            }}
          />
        </Box>
        <Box>
          {ores.map((ore, idx) => (
            <Grid2 container spacing={2} key={`ore-${idx}`}>
              <Grid2 xs={2}>
                <Box>{ore.ore?.slice(0, 4)}</Box>
              </Grid2>
              <Grid2 xs={7}>
                <Slider
                  aria-label="Small steps"
                  step={1}
                  getAriaValueText={(value) => `${value}%`}
                  valueLabelFormat={(value) => `${value.toFixed(0)}%`}
                  value={(ore.percent as number) * 100}
                  onChange={(event: Event, newValue: number | number[]) => {
                    if (typeof newValue === 'number') {
                      let retVal = Math.round(newValue + Number.EPSILON) / 100
                      if (retVal < 0) retVal = 0
                      if (retVal > 0.5) retVal = 0.5
                      const newOres = newShipRock.ores?.map((o) => {
                        if (o.ore === ore.ore) {
                          return { ...o, percent: retVal }
                        } else {
                          return o
                        }
                      })
                      setNewShipRock({ ...newShipRock, ores: newOres })
                    }
                  }}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 50, label: '50%' },
                  ]}
                  min={0}
                  max={50}
                  valueLabelDisplay="auto"
                />
              </Grid2>
              <Grid2 xs={3}>
                <TextField
                  value={((ore.percent as number) * 100).toFixed(0)}
                  sx={{ width: 100 }}
                  onChange={(event) => {
                    const newOres = newShipRock.ores?.map((o) => {
                      let retVal = Math.round(Number(event.target.value) + Number.EPSILON) / 100
                      if (retVal < 0) retVal = 0
                      if (retVal > 0.5) retVal = 0.5
                      if (o.ore === ore.ore) {
                        return { ...o, percent: retVal }
                      }
                      return o
                    })
                    setNewShipRock({ ...newShipRock, ores: newOres })
                  }}
                  variant="outlined"
                  type="number"
                  size="small"
                />
              </Grid2>
            </Grid2>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <div style={{ flexGrow: 1 }} />
        <Button
          color="secondary"
          size="large"
          variant={'text'}
          onClick={() => {
            onSubmit(newShipRock)
            onClose()
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const markIntervals = [3, 4, 5, 6, 7, 8, 9]
const marks = markIntervals.map((mark) => ({ value: mark * 1000, label: mark + 'K' }))
