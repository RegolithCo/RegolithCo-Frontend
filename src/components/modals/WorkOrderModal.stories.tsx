import React, { useEffect } from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { WorkOrderModal as WorkOrderModalC } from './WorkOrderModal'
import {
  fakeOtherOrder,
  fakeSalvageOrder,
  fakeShipMiningOrder,
  fakeVehicleMiningOrder,
} from '@regolithco/common/dist/mock'
import { ActivityEnum, WorkOrder } from '@regolithco/common'
import { WorkOrderContext, workOrderContextDefaults } from '../../context/workOrder.context'
import { useStorybookLookups } from '../../hooks/useLookupStorybook'

export default {
  title: 'Modals/WorkOrderModal',
  component: WorkOrderModalC,
  argTypes: {
    activity: {
      control: {
        type: 'select',
        defaultValue: ActivityEnum.ShipMining,
        options: Object.values(ActivityEnum),
      },
    },
  },
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof WorkOrderModalC>

const Template: StoryFn<typeof WorkOrderModalC> = ({ ...args }) => {
  const [workOrder, setWorkOrder] = React.useState<WorkOrder>()
  const dataStore = useStorybookLookups()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { activity } = args as any

  useEffect(() => {
    const fakeWorkOrders = async () => {
      if (!dataStore.ready) return
      switch (activity) {
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
  }, [activity])

  if (!workOrder) return <div>loading</div>
  return (
    <WorkOrderContext.Provider
      value={{
        ...workOrderContextDefaults,
        workOrder,
      }}
    >
      <WorkOrderModalC {...args} />
    </WorkOrderContext.Provider>
  )
}

export const Create = Template.bind({})
Create.args = {
  open: true,
  // isNew: true,
  // allowEdit: true,
  onClose: () => {
    console.log('Closed')
  },
}

export const Edit = Template.bind({})
Edit.args = {
  open: true,
  // isNew: false,
  // allowEdit: true,
  onClose: () => {
    console.log('Closed')
  },
}

export const View = Template.bind({})
View.args = {
  open: true,
  // isNew: false,
  // allowEdit: false,
  // onUpdate: (order) => {
  //   log.debug('ShipMiningOrderUpdate', order)
  // },
  onClose: () => {
    console.log('Closed')
  },
}
