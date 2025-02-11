import React, { useEffect } from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { WorkOrderCalc } from './WorkOrderCalc'
import {
  fakeShipMiningOrder,
  fakeVehicleMiningOrder,
  fakeSalvageOrder,
  fakeOtherOrder,
} from '@regolithco/common/dist/__mocks__'
import log from 'loglevel'
import { WorkOrder, RefineryMethodEnum, RefineryEnum, ActivityEnum } from '@regolithco/common'
import { useStorybookLookups } from '../../../hooks/useLookupStorybook'

export default {
  title: 'Calculators/WorkOrder',
  component: WorkOrderCalc,
  argTypes: {
    method: {
      control: {
        type: 'select',
        options: Object.values(RefineryMethodEnum),
      },
    },
    refinery: {
      control: {
        type: 'select',
        options: Object.values(RefineryEnum),
      },
    },
    forceTemplate: {
      control: { type: 'boolean' },
    },
    isRefined: {
      control: { type: 'boolean' },
    },
    includeTransferFee: {
      control: { type: 'boolean' },
    },
    shareRefinedValue: {
      control: { type: 'boolean' },
    },
  },
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
    backgrounds: {
      values: [
        { name: 'red', value: '#f00' },
        { name: 'green', value: '#0f0' },
        { name: 'blue', value: '#00f' },
      ],
    },
  },
} as Meta<typeof WorkOrderCalc>

const Template: StoryFn<{
  orderType: ActivityEnum
}> = (args) => {
  const { orderType, ...other } = args
  const [workOrder, setWorkOrder] = React.useState<WorkOrder>()
  const dataStore = useStorybookLookups()

  useEffect(() => {
    const fakeWorkOrders = async () => {
      if (!dataStore.ready) return
      switch (orderType) {
        case ActivityEnum.ShipMining:
          setWorkOrder(await fakeShipMiningOrder(dataStore))
          break
        case ActivityEnum.VehicleMining:
          setWorkOrder(await fakeVehicleMiningOrder())
          break
        case ActivityEnum.Salvage:
          setWorkOrder(await fakeSalvageOrder())
          break
        case ActivityEnum.Other:
          setWorkOrder(await fakeOtherOrder())
          break
      }
    }
    fakeWorkOrders()
  }, [orderType])

  const onChange = (order: WorkOrder) => {
    log.debug(`WorkOrderUpdate: ${orderType}`, order)
  }
  if (!workOrder) return <div>loading fake workorder...</div>

  const otherWorkOrder = other as Partial<WorkOrder>
  const newWorkOrder: WorkOrder = { ...workOrder, ...otherWorkOrder } as WorkOrder
  // const crewShares = newWorkOrder.crewShares as CrewShare[]
  return <WorkOrderCalc onChange={onChange} workOrder={newWorkOrder} />
}

export const Empty = Template.bind({})
Empty.args = {}

export const ShipMiningOrder = Template.bind({})
ShipMiningOrder.args = {
  orderType: ActivityEnum.ShipMining,
}
export const VehicleMiningOrder = Template.bind({})
VehicleMiningOrder.args = {
  orderType: ActivityEnum.VehicleMining,
}
export const SalvageOrder = Template.bind({})
SalvageOrder.args = {
  orderType: ActivityEnum.Salvage,
}

export const OtherOrder = Template.bind({})
OtherOrder.args = {
  orderType: ActivityEnum.Other,
}

export const ShipOrderWithTemplate = Template.bind({})
ShipOrderWithTemplate.args = {
  orderType: ActivityEnum.ShipMining,
}
