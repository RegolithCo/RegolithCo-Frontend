import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { ActivityEnum, lookups, ShipStats } from '@orgminer/common'
import { fontFamilies } from '../../../../theme'

export interface ReferenceTablesProps {
  activity: ActivityEnum
}

export const ReferenceTables: React.FC<ReferenceTablesProps> = ({ activity }) => {
  const lups = lookups.shipLookups
  const rows: [ShipStats, number, string, string][] = []
  let show = true
  switch (activity) {
    case ActivityEnum.ShipMining:
      rows.push([lups.PROSPECTOR as ShipStats, 100, 'miningHold', 'cSCU'])
      rows.push([lups.MOLE as ShipStats, 100, 'miningHold', 'cSCU'])
      break
    case ActivityEnum.VehicleMining:
      rows.push([lups.ROC as ShipStats, 1000, 'miningHold', 'mSCU'])
      rows.push([lups.ROC_DS as ShipStats, 1000, 'miningHold', 'mSCU'])
      break
    case ActivityEnum.Salvage:
      rows.push([lups.RECLAIMER as ShipStats, 1, 'cargo', 'SCU'])
      rows.push([lups.VULTURE as ShipStats, 1, 'cargo', 'SCU'])
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
            <TableCell colSpan={2}>Referennce Capacities:</TableCell>
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
