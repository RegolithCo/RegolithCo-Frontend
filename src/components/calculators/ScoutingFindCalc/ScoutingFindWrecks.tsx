import * as React from 'react'
import { Typography, SxProps, Theme, Box, Button, Grid } from '@mui/material'
import {
  ScoutingFind,
  RockStateEnum,
  ScoutingFindStateEnum,
  FindClusterSummary,
  SalvageWreck,
  SalvageFind,
  SalvageOreEnum,
  SalvageWreckOre,
  ShipRock,
} from '@regolithco/common'
import { ClawIcon } from '../../../icons'
import { AddCircle } from '@mui/icons-material'
import { scoutingFindStateThemes } from '../../../theme'
import { EmptyScanCard } from '../../cards/EmptyScanCard'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import { SalvageWreckCard } from '../../cards/SalvageWreckCard'
dayjs.extend(relativeTime)

export interface ScoutingFindWrecksProps {
  salvageFind: SalvageFind
  summary: FindClusterSummary
  addScanModalOpen?: false | ShipRock | SalvageWreck
  editScanModalOpen?: [number, false | ShipRock | SalvageWreck]
  setAddScanModalOpen: (scan: SalvageWreck | false) => void
  setEditScanModalOpen: (scan: [number, SalvageWreck | false]) => void
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
export const ScoutingFindWrecks: React.FC<ScoutingFindWrecksProps> = ({
  salvageFind,
  summary,
  isShare,
  allowEdit,
  addScanModalOpen,
  editScanModalOpen,
  setAddScanModalOpen,
  setEditScanModalOpen,
  onChange,
}) => {
  const theme = scoutingFindStateThemes[salvageFind.state || ScoutingFindStateEnum.Discovered]
  const styles = stylesThunk(theme)

  // Some convenience variables
  // let scanComplete = false
  const hasScans = salvageFind.wrecks && salvageFind.wrecks.length > 0
  const numScans = hasScans ? salvageFind.wrecks.length : 0

  // Convenience type guards
  const clusterCount = salvageFind.clusterCount || 1

  // Just a handy array to map over
  const placeholderItems: unknown[] =
    clusterCount > 0 && clusterCount > numScans ? Array.from({ length: clusterCount - numScans }, (_, i) => 1) : []

  return (
    <Grid container paddingX={2} size={{ xs: 12 }} sx={styles.bottomRowGrid}>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex' }}>
          <Typography variant="overline" component="div">
            Wrecks Scanned: {salvageFind.wrecks?.length}/{salvageFind.clusterCount || 0}
          </Typography>
          <div style={{ flexGrow: 1 }} />
          {allowEdit && (
            <Button
              startIcon={<AddCircle />}
              size="small"
              variant="text"
              onClick={() => {
                setEditScanModalOpen([-1, false])

                onChange &&
                  onChange({
                    ...salvageFind,
                    clusterCount: (salvageFind.clusterCount || 0) + 1,
                  })
              }}
            >
              Add Wreck
            </Button>
          )}
        </Box>
        <Grid
          container
          sx={isShare ? styles.scansGridShare : styles.scansGrid}
          margin={{ xs: 0, sm: 1 }}
          spacing={{ xs: 1, sm: 2 }}
        >
          {(salvageFind.wrecks || []).map((wreck, idx) => {
            return (
              <Grid key={idx} size={{ xs: 6, sm: 4, md: 3 }}>
                <SalvageWreckCard
                  wreck={wreck}
                  wreckValue={summary.byRock && summary.byRock.length > idx ? summary.byRock[idx].value : undefined}
                  allowEdit={allowEdit}
                  onChangeState={(newState) => {
                    onChange &&
                      onChange({
                        ...salvageFind,
                        wrecks: (salvageFind.wrecks || []).map((r, idxx) => ({
                          ...r,
                          state: idxx === idx ? newState : r.state,
                        })),
                      })
                  }}
                  onEditClick={() => {
                    setAddScanModalOpen(false)
                    setEditScanModalOpen([idx, wreck])
                  }}
                />
              </Grid>
            )
          })}
          {placeholderItems.map((_, idx) => (
            <Grid key={idx} size={{ xs: 6, sm: 4, md: 3 }}>
              <EmptyScanCard
                Icon={ClawIcon}
                deleteDisabled={!salvageFind.clusterCount || salvageFind.clusterCount <= 1}
                onDelete={() => {
                  if (!salvageFind.wrecks || !salvageFind.clusterCount) return
                  if (salvageFind.clusterCount <= salvageFind.wrecks.length) return
                  if (salvageFind.clusterCount <= 1) return
                  onChange &&
                    onChange({
                      ...salvageFind,
                      clusterCount: salvageFind.clusterCount - 1,
                    })
                }}
                onClick={() => {
                  setEditScanModalOpen([-1, false])
                  setAddScanModalOpen({
                    __typename: 'SalvageWreck',
                    state: RockStateEnum.Ready,
                    isShip: false,
                    salvageOres: Object.values(SalvageOreEnum).map(
                      (ore) =>
                        ({
                          ore,
                          scu: 0,
                        }) as SalvageWreckOre
                    ),
                    sellableAUEC: null,
                    shipCode: null,
                  })
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Grid>
  )
}
