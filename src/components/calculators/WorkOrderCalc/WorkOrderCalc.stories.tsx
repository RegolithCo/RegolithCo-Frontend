import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { WorkOrderCalc } from './WorkOrderCalc'
import {
  fakeShipMiningOrder,
  fakeVehicleMiningOrder,
  fakeSalvageOrder,
  fakeOtherOrder,
  fakeWorkOrders,
} from '@regolithco/common/dist/mock'
import log from 'loglevel'
import { WorkOrder, RefineryMethodEnum, RefineryEnum, CrewShare } from '@regolithco/common'

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

const Template: StoryFn<typeof WorkOrderCalc> = (args) => {
  const { onChange, workOrder, ...other } = args
  if (workOrder) {
    const otherWorkOrder = other as Partial<WorkOrder>
    const newWorkOrder: WorkOrder = { ...workOrder, ...otherWorkOrder } as WorkOrder
    const crewShares = newWorkOrder.crewShares as CrewShare[]
    return <WorkOrderCalc onChange={onChange} workOrder={newWorkOrder} />
  }
  return <WorkOrderCalc workOrder={args.workOrder} onChange={args.onChange} />
}

export const Empty = Template.bind({})
Empty.args = {}

export const ShipMiningOrder = Template.bind({})
ShipMiningOrder.args = {
  workOrder: fakeShipMiningOrder(),
  onChange: (order) => {
    log.debug('ShipMiningOrderUpdate', order)
  },
}
export const VehicleMiningOrder = Template.bind({})
VehicleMiningOrder.args = {
  workOrder: fakeVehicleMiningOrder(),
  onChange: (order) => {
    log.debug('VehicleMiningOrderUpdate', order)
  },
}
export const SalvageOrder = Template.bind({})
SalvageOrder.args = {
  workOrder: fakeSalvageOrder(),
  onChange: (order) => {
    log.debug('SalvageOrderUpdate', order)
  },
}

export const OtherOrder = Template.bind({})
OtherOrder.args = {
  workOrder: fakeOtherOrder(),
  onChange: (order) => {
    log.debug('OtherOrderUpdate', order)
  },
}

export const ShipOrderWithTemplate = Template.bind({})
ShipOrderWithTemplate.args = {
  workOrder: fakeShipMiningOrder(),
  // templateJob: fakeWorkOrders().
  onChange: (order) => {
    log.debug('WorkOrderUpdate', order)
  },
}
