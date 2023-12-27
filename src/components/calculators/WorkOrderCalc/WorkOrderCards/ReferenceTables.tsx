import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { ActivityEnum, Vehicle } from '@regolithco/common'
import { fontFamilies } from '../../../../theme'
import { useAsyncLookupData } from '../../../../hooks/useLookups'

export interface ReferenceTablesProps {
  activity: ActivityEnum
}

export const ReferenceTables: React.FC<ReferenceTablesProps> = ({ activity }) => {
  const lups = useAsyncLookupData((ds) => ds.getLookup('shipLookups')) || []
  const rows: [Vehicle, number, string, string][] = []
  let show = true
  switch (activity) {
    case ActivityEnum.ShipMining:
      rows.push([lups.find(({ code }) => code === 'MPROSP') as Vehicle, 100, 'miningHold', 'cSCU'])
      rows.push([lups.find(({ code }) => code === 'ARMOLE') as Vehicle, 100, 'miningHold', 'cSCU'])
      break
    case ActivityEnum.VehicleMining:
      rows.push([lups.find(({ code }) => code === 'GREROC') as Vehicle, 1000, 'miningHold', 'mSCU'])
      rows.push([lups.find(({ code }) => code === 'GRERCD') as Vehicle, 1000, 'miningHold', 'mSCU'])
      break
    case ActivityEnum.Salvage:
      rows.push([lups.find(({ code }) => code === 'RECLAI') as Vehicle, 1, 'cargo', 'SCU'])
      rows.push([lups.find(({ code }) => code === 'VULTUR') as Vehicle, 1, 'cargo', 'SCU'])
      break
    default:
      show = false
  }
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
          {rows.map(([ship, mult, cargoKey, unit], idx) => (
            <TableRow key={`ref-${idx}`}>
              <TableCell>{ship.name}</TableCell>
              <TableCell align="right" sx={{ fontFamily: fontFamilies.robotoMono }}>
                {cargoKey === 'cargo' ? (ship.cargo as number) * mult : (ship.miningHold as number) * mult} {unit}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
