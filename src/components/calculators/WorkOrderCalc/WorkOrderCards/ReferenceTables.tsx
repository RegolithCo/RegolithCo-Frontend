import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { ActivityEnum, ShipLookups, Vehicle } from '@regolithco/common'
import { fontFamilies } from '../../../../theme'
import { LookupsContext } from '../../../../context/lookupsContext'

export interface ReferenceTablesProps {
  activity: ActivityEnum
}

export const ReferenceTables: React.FC<ReferenceTablesProps> = ({ activity }) => {
  const dataStore = React.useContext(LookupsContext)

  if (!dataStore.ready) return null
  const lups = dataStore.getLookup('shipLookups') as ShipLookups

  const rows: [Vehicle, number, string, string][] = []
  let show = true
  switch (activity) {
    case ActivityEnum.ShipMining:
      rows.push([lups.find(({ UEXID }) => UEXID === 'MPROSP') as Vehicle, 100, 'miningHold', 'cSCU'])
      rows.push([lups.find(({ UEXID }) => UEXID === 'ARMOLE') as Vehicle, 100, 'miningHold', 'cSCU'])
      break
    case ActivityEnum.VehicleMining:
      rows.push([lups.find(({ UEXID }) => UEXID === 'GREROC') as Vehicle, 1000, 'miningHold', 'mSCU'])
      rows.push([lups.find(({ UEXID }) => UEXID === 'GRERCD') as Vehicle, 1000, 'miningHold', 'mSCU'])
      break
    case ActivityEnum.Salvage:
      rows.push([lups.find(({ UEXID }) => UEXID === 'RECLAI') as Vehicle, 1, 'cargo', 'SCU'])
      rows.push([lups.find(({ UEXID }) => UEXID === 'VULTUR') as Vehicle, 1, 'cargo', 'SCU'])
      break
    default:
      show = false
  }
  if (!dataStore.ready) return <div>Loading...</div>
  if (!show) return null
  return (
    <TableContainer
      sx={{ border: '1px solid', my: 2, borderRadius: 2, fontFamily: fontFamilies.robotoMono, fontWeight: 'bold' }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell colSpan={2}>Reference Capacities:</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(([ship, mult, cargoKey, unit], idx) => {
            if (!ship) return null
            return (
              <TableRow key={`ref-${idx}`}>
                <TableCell>{ship.name}</TableCell>
                <TableCell align="right" sx={{ fontFamily: fontFamilies.robotoMono }}>
                  {cargoKey === 'cargo' ? (ship.cargo as number) * mult : (ship.miningHold as number) * mult} {unit}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
