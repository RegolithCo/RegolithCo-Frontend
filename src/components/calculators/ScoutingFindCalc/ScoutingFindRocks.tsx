import * as React from 'react'
import { Typography, SxProps, Theme, Box, Button } from '@mui/material'
import {
  ScoutingFind,
  ShipClusterFind,
  RockStateEnum,
  ScoutingFindStateEnum,
  FindClusterSummary,
  ShipRock,
} from '@regolithco/common'
import { RockIcon } from '../../../icons'
import { AddCircle } from '@mui/icons-material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { ShipRockCard } from '../../cards/ShipRockCard'
import { scoutingFindStateThemes } from '../../../theme'
import { EmptyScanCard } from '../../cards/EmptyScanCard'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import { ShipRockEntryModal } from '../../modals/ShipRockEntryModal'

dayjs.extend(relativeTime)

export interface ScoutingFindRocksProps {
  shipFind: ShipClusterFind
  summary: FindClusterSummary
  allowEdit?: boolean
  isShare?: boolean
  onChange?: (scoutingFind: ScoutingFind) => void
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  // YES
  bottomRowGrid: {
    width: '100%',
    // border: '1px solid green!important',
  },
  // YES
  scansGrid: {
    [theme.breakpoints.up('md')]: {
      // display: 'flex',
      height: '100%',
      maxHeight: 200,
      overflowX: 'auto',
      overflowY: 'scroll',
    },
  },
  // YES
  scansGridShare: {
    //
  },
})

/**
 * This is the wrpaper for all the types of things scouts can find
 * @param param0
 * @returns
 */
export const ScoutingFindRocks: React.FC<ScoutingFindRocksProps> = ({
  shipFind,
  summary,
  isShare,
  allowEdit,
  onChange,
}) => {
  const theme = scoutingFindStateThemes[shipFind.state || ScoutingFindStateEnum.Discovered]
  const styles = stylesThunk(theme)

  const [addScanModalOpen, setAddScanModalOpen] = React.useState<ShipRock | false>(false)
  const [editScanModalOpen, setEditScanModalOpen] = React.useState<[number, ShipRock | false]>([-1, false])

  // Some convenience variables
  // let scanComplete = false
  const hasScans = shipFind.shipRocks && shipFind.shipRocks.length > 0
  const numScans = hasScans ? shipFind.shipRocks.length : 0

  // Convenience type guards
  const clusterCount = shipFind.clusterCount || 0

  // Just a handy array to map over
  const placeholderItems: unknown[] =
    clusterCount > 0 && clusterCount > numScans ? Array.from({ length: clusterCount - numScans }, (_, i) => 1) : []

  return (
    <Grid container paddingX={2} xs={12} sx={styles.bottomRowGrid}>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex' }}>
          <Typography variant="overline" component="div">
            Rocks Scanned: {shipFind.shipRocks?.length}/{shipFind.clusterCount || 0}
          </Typography>
          <div style={{ flexGrow: 1 }} />
          {allowEdit && (
            <Button
              startIcon={<AddCircle />}
              size="small"
              variant="text"
              onClick={() => {
                setEditScanModalOpen([-1, false])
                // setAddScanModalOpen({
                //   __typename: 'ShipRock',
                //   state: RockStateEnum.Ready,
                //   mass: 3000,
                //   ores: [],
                // })
                onChange &&
                  onChange({
                    ...shipFind,
                    clusterCount: (shipFind.clusterCount || 0) + 1,
                  })
              }}
            >
              Add Rock to Cluster
            </Button>
          )}
        </Box>
        <Grid
          container
          sx={isShare ? styles.scansGridShare : styles.scansGrid}
          margin={{ xs: 0, sm: 1 }}
          spacing={{ xs: 1, sm: 2 }}
        >
          {(shipFind.shipRocks || []).map((rock, idx) => {
            const newOres = [...(rock.ores || [])]
            newOres.sort((a, b) => (b.percent || 0) - (a.percent || 0))
            const newRock = { ...rock, ores: newOres }
            return (
              <Grid key={idx} xs={6} sm={4} md={3}>
                <ShipRockCard
                  rock={newRock}
                  rockValue={summary.byRock && summary.byRock.length > idx ? summary.byRock[idx].value : undefined}
                  allowEdit={allowEdit}
                  onChangeState={(newState) => {
                    onChange &&
                      onChange({
                        ...shipFind,
                        shipRocks: (shipFind.shipRocks || []).map((r, idxx) => ({
                          ...r,
                          state: idxx === idx ? newState : r.state,
                        })),
                      })
                  }}
                  onEditClick={() => {
                    setAddScanModalOpen(false)
                    setEditScanModalOpen([idx, rock])
                  }}
                />
              </Grid>
            )
          })}
          {placeholderItems.map((_, idx) => (
            <Grid key={idx} xs={6} sm={4} md={3}>
              <EmptyScanCard
                Icon={RockIcon}
                onDelete={() => {
                  if (!shipFind.shipRocks || !shipFind.clusterCount) return
                  if (shipFind.clusterCount <= shipFind.shipRocks.length) return
                  onChange &&
                    onChange({
                      ...shipFind,
                      clusterCount: shipFind.clusterCount - 1,
                    })
                }}
                onClick={() => {
                  setEditScanModalOpen([-1, false])
                  setAddScanModalOpen({
                    __typename: 'ShipRock',
                    state: RockStateEnum.Ready,
                    mass: 3000,
                    ores: [],
                  })
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <ShipRockEntryModal
        open={addScanModalOpen !== false || editScanModalOpen[1] !== false}
        isNew={addScanModalOpen !== false}
        onClose={() => {
          addScanModalOpen !== false && setAddScanModalOpen(false)
          editScanModalOpen[1] !== false && setEditScanModalOpen([-1, false])
        }}
        onDelete={() => {
          // Just discard. No harm, no foul
          addScanModalOpen !== false && setAddScanModalOpen(false)
          // Actually remove the rock from the list
          if (editScanModalOpen[1] !== false) {
            onChange &&
              onChange({
                ...(shipFind || {}),
                shipRocks: (shipFind?.shipRocks || []).filter((rock, idx) => idx !== editScanModalOpen[0]),
              })
            setEditScanModalOpen([-1, false])
          }
        }}
        onSubmit={(rock) => {
          if (addScanModalOpen !== false) {
            onChange &&
              onChange({
                ...(shipFind || {}),
                clusterCount: Math.max(shipFind?.clusterCount || 0, shipFind?.shipRocks.length + 1),
                shipRocks: [...(shipFind?.shipRocks || []), rock],
              })
            setAddScanModalOpen(false)
          } else if (editScanModalOpen[1] !== false) {
            onChange &&
              onChange({
                ...(shipFind || {}),
                shipRocks: (shipFind?.shipRocks || []).map((r, idx) => (idx === editScanModalOpen[0] ? rock : r)),
              })
            setEditScanModalOpen([-1, false])
          }
        }}
        shipRock={addScanModalOpen !== false ? addScanModalOpen : (editScanModalOpen[1] as ShipRock)}
      />
    </Grid>
  )
}
