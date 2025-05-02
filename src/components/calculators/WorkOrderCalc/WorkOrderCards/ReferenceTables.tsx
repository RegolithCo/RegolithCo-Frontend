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
      rows.push([lups.find(({ UEXID }) => UEXID === '148') as Vehicle, 100, 'miningHold', 'cSCU'])
      rows.push([lups.find(({ UEXID }) => UEXID === '251') as Vehicle, 100, 'miningHold', 'cSCU'])
      // rows.push([lups.find(({ UEXID }) => UEXID === '14800') as Vehicle, 100, 'miningHold', 'cSCU'])
      rows.push([lups.find(({ UEXID }) => UEXID === '122') as Vehicle, 100, 'miningHold', 'cSCU'])
      break
    case ActivityEnum.VehicleMining:
      // ROC
      rows.push([lups.find(({ UEXID }) => UEXID === '168') as Vehicle, 1000, 'miningHold', 'mSCU'])
      // ROC-DS
      rows.push([lups.find(({ UEXID }) => UEXID === '169') as Vehicle, 1000, 'miningHold', 'mSCU'])
      // ATLS
      rows.push([lups.find(({ UEXID }) => UEXID === '252') as Vehicle, 1000, 'miningHold', 'mSCU'])
      break
    case ActivityEnum.Salvage:
      rows.push([lups.find(({ UEXID }) => UEXID === '159') as Vehicle, 1, 'cargo', 'SCU'])
      rows.push([lups.find(({ UEXID }) => UEXID === '234') as Vehicle, 1, 'cargo', 'SCU'])
      rows.push([lups.find(({ UEXID }) => UEXID === '201') as Vehicle, 1, 'cargo', 'SCU'])
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
