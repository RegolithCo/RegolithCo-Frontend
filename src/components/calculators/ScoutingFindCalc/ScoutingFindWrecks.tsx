import * as React from 'react'
import { Typography, SxProps, Theme, Box, Button } from '@mui/material'
import {
  ScoutingFind,
  RockStateEnum,
  ScoutingFindStateEnum,
  FindClusterSummary,
  SalvageWreck,
  SalvageFind,
  SalvageOreEnum,
  SalvageWreckOre,
} from '@regolithco/common'
import { ClawIcon } from '../../../icons'
import { AddCircle } from '@mui/icons-material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { scoutingFindStateThemes } from '../../../theme'
import { EmptyScanCard } from '../../cards/EmptyScanCard'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import { SalvageWreckCard } from '../../cards/SalvageWreckCard'
import { SalvageWreckEntryModal } from '../../modals/SalvageWreckEntryModal'
dayjs.extend(relativeTime)

export interface ScoutingFindWrecksProps {
  salvageFind: SalvageFind
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
export const ScoutingFindWrecks: React.FC<ScoutingFindWrecksProps> = ({
  salvageFind,
  summary,
  isShare,
  allowEdit,
  onChange,
}) => {
  const theme = scoutingFindStateThemes[salvageFind.state || ScoutingFindStateEnum.Discovered]
  const styles = stylesThunk(theme)
  const [addScanModalOpen, setAddScanModalOpen] = React.useState<SalvageWreck | false>(false)
  const [editScanModalOpen, setEditScanModalOpen] = React.useState<[number, SalvageWreck | false]>([-1, false])

  // Some convenience variables
  // let scanComplete = false
  const hasScans = salvageFind.wrecks && salvageFind.wrecks.length > 0
  const numScans = hasScans ? salvageFind.wrecks.length : 0

  // Convenience type guards
  const clusterCount = salvageFind.clusterCount || 0

  // Just a handy array to map over
  const placeholderItems: unknown[] =
    clusterCount > 0 && clusterCount > numScans ? Array.from({ length: clusterCount - numScans }, (_, i) => 1) : []

  return (
    <Grid container paddingX={2} xs={12} sx={styles.bottomRowGrid}>
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
              <Grid key={idx} xs={6} sm={4} md={3}>
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
            <Grid key={idx} xs={6} sm={4} md={3}>
              <EmptyScanCard
                Icon={ClawIcon}
                onDelete={() => {
                  if (!salvageFind.wrecks || !salvageFind.clusterCount) return
                  if (salvageFind.clusterCount <= salvageFind.wrecks.length) return
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
                    isShip: true,
                    salvageOres: Object.keys(SalvageOreEnum).map(
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
      <SalvageWreckEntryModal
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
                ...(salvageFind || {}),
                wrecks: (salvageFind?.wrecks || []).filter((rock, idx) => idx !== editScanModalOpen[0]),
              })
            setEditScanModalOpen([-1, false])
          }
        }}
        onSubmit={(wreck) => {
          if (addScanModalOpen !== false) {
            onChange &&
              onChange({
                ...(salvageFind || {}),
                clusterCount: Math.max(salvageFind?.clusterCount || 0, salvageFind?.wrecks.length + 1),
                wrecks: [...(salvageFind?.wrecks || []), wreck],
              })
            setAddScanModalOpen(false)
          } else if (editScanModalOpen[1] !== false) {
            onChange &&
              onChange({
                ...(salvageFind || {}),
                wrecks: (salvageFind?.wrecks || []).map((r, idx) => (idx === editScanModalOpen[0] ? wreck : r)),
              })
            setEditScanModalOpen([-1, false])
          }
        }}
        wreck={addScanModalOpen !== false ? addScanModalOpen : (editScanModalOpen[1] as SalvageWreck)}
      />
    </Grid>
  )
}
