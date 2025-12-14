import { useTheme } from '@mui/material'
import * as React from 'react'
import { SessionContext } from '../../context/session.context'
import {
  calculateWorkOrder,
  createSafeFileName,
  CrewShare,
  jsonSerializeBigInt,
  makeHumanIds,
  session2Json,
  ShipLookups,
} from '@regolithco/common'
import { downloadFile } from '../../lib/utils'
import dayjs from 'dayjs'
import { DownloadModal } from './DownloadModal'
import { LookupsContext } from '../../context/lookupsContext'
import { MValueFormat, MValueFormatter } from '../fields/MValue'

export type DownloadModalContainerProps = {
  open: boolean
  onClose: () => void
}

export const DownloadModalContainer: React.FC<DownloadModalContainerProps> = ({ open, onClose }) => {
  const theme = useTheme()
  const { session } = React.useContext(SessionContext)
  const dataStore = React.useContext(LookupsContext)
  const shipLookups = dataStore.getLookup('shipLookups') as ShipLookups
  const [ships, setShips] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    if (!dataStore.ready) return
    const shipCodeLookup: Record<string, string> =
      shipLookups.reduce(
        (acc, { UEXID, name }) => {
          acc[UEXID] = name
          return acc
        },
        {} as Record<string, string>
      ) || {}
    setShips(shipCodeLookup)
  }, [dataStore.ready, shipLookups])

  if (!session || !dataStore.ready || Object.keys(shipLookups).length === 0) return null

  return (
    <DownloadModal
      open={open}
      onClose={onClose}
      downloadJSON={() => {
        if (!session) return
        const jsonObj = jsonSerializeBigInt(session2Json(session))
        downloadFile(
          jsonObj,
          createSafeFileName(session.name || 'Session', session.sessionId) + '.json',
          'application/json'
        )
      }}
      downloadMembersCSV={() => {
        const members = session?.activeMembers?.items || []
        const innactives = session?.mentionedUsers || []

        const headers = ['SCName', 'Captain', 'isPilot', 'ship Name', 'vehicle Code']
        const userLookup: Record<string, string> =
          session.activeMembers?.items.reduce(
            (acc, { owner }) => {
              if (owner) acc[owner.userId] = owner.scName
              return acc
            },
            {} as Record<string, string>
          ) || {}

        const csvMembers = members
          .map(({ owner, captainId, isPilot, shipName, vehicleCode }) => {
            const captain = members.find((m) => m.owner?.userId === captainId)
            return [
              owner?.scName,
              captain?.owner?.scName,
              Boolean(isPilot),
              shipName,
              vehicleCode ? ships[vehicleCode] || vehicleCode : '',
            ]
              .map((col) => {
                const strVal = String(col)
                if (strVal.includes(',')) {
                  return `"${strVal}"`
                }
                return strVal
              })
              .join(',')
          })
          .join('\n')

        const csvInnactives = innactives
          .map(({ scName, captainId }) => [scName, captainId ? userLookup[captainId] : '', false, '', ''].join(','))
          .join('\n')

        downloadFile(
          [headers.join(','), csvMembers, csvInnactives].join('\n'),
          createSafeFileName(session.name || 'Session', session.sessionId) + '_members.csv',
          'text/csv'
        )
      }}
      downloadWorkOrderCSV={async () => {
        const workOrders = session?.workOrders?.items || []
        const calculatedWorkOrders = await Promise.all(workOrders.map((wo) => calculateWorkOrder(dataStore, wo)))
        const headers = [
          'Created',
          'Session',
          'orderType',
          'orderId',
          'Owner',
          'Seller',
          'State',
          'isSold',
          'allPaid',
          'expensesValue',
          'grossValue',
          'payoutsTotal',
          'shareAmount',
          'transferFees',
          'refinedValue',
          'refiningTime',
          'unrefinedValue',
          'lossValue',
          'sellerScName',
          'remainder',
          'Note',
        ]
        const csv = workOrders
          .map(({ orderId, owner, sellerscName, orderType, isSold, state, note, createdAt, expenses }, idx) => {
            const {
              allPaid,
              expensesValue,
              grossValue,
              payoutsTotal,
              shareAmount,
              transferFees,
              refinedValue,
              refiningTime,
              unrefinedValue,
              lossValue,
              sellerScName,
              remainder,
            } = calculatedWorkOrders[idx]
            return [
              dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss'),
              session.name,
              orderType,
              makeHumanIds(sellerscName || owner?.scName, orderId),
              owner?.scName,
              sellerscName || '',
              state,
              Boolean(isSold),
              allPaid,
              expensesValue,
              Math.round(Number(grossValue || 0n)),
              Math.round(Number(payoutsTotal || 0n)),
              Math.round(Number(shareAmount || 0n)),
              Math.round(Number(transferFees || 0n)),
              Math.round(Number(refinedValue || 0n)),
              MValueFormatter(refiningTime, MValueFormat.duration),
              Math.round(Number(unrefinedValue || 0n)),
              Math.round(Number(lossValue || 0n)),
              sellerScName,
              Math.round(Number(remainder || 0n)),
              note,
            ]
              .map((col) => {
                const strVal = String(col)
                if (strVal.includes(',')) {
                  return `"${strVal}"`
                }
                return strVal
              })
              .join(',')
          })
          .join('\n')

        downloadFile(
          [headers.join(','), csv].join('\n'),
          createSafeFileName(session.name || 'Session', session.sessionId) + '_workorders.csv',
          'text/csv'
        )
      }}
      downloadCrewShareCSV={() => {
        const crewShares: CrewShare[] =
          session?.workOrders?.items?.reduce((acc, wo) => {
            if (wo.crewShares) acc.push(...wo.crewShares)
            return acc
          }, [] as CrewShare[]) || []

        const headers = ['Created', 'Session', 'Work Order', 'Payer', 'Payee', 'Share', 'Type', 'Paid', 'Note']

        const csv = crewShares
          .map(({ orderId, payeeScName, payeeUserId, share, shareType, note, createdAt, state }) => {
            const workOrder = session?.workOrders?.items?.find(({ orderId: woId }) => woId === orderId)
            return [
              dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss'),
              session?.name,
              workOrder ? makeHumanIds(workOrder.sellerscName || workOrder.owner?.scName, orderId) : '',
              workOrder ? workOrder.sellerscName || workOrder.owner?.scName : '',
              payeeScName,
              share,
              shareType,
              state ? true : false,
              note,
            ]
              .map((col) => {
                const strVal = String(col)
                if (strVal.includes(',')) {
                  return `"${strVal}"`
                }
                return strVal
              })
              .join(',')
          })
          .join('\n')

        // Ok, now cobble this together and download it
        downloadFile(
          [headers.join(','), csv].join('\n'),
          createSafeFileName(session.name || 'Session', session.sessionId) + '_crewshares.csv',
          'text/csv'
        )
      }}
    />
  )
}
