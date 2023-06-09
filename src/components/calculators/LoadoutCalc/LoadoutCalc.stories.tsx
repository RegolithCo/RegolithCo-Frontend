import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { LoadoutCalc as LoadoutCalcC } from './LoadoutCalc'
import { fakeUser } from '@regolithco/common/dist/mock'
import { LoadoutShipEnum, MiningLaserEnum, MiningModuleEnum } from '@regolithco/common'

export default {
  title: 'Calcul/LoadoutCalc',
  component: LoadoutCalcC,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof LoadoutCalcC>

const Template: ComponentStory<typeof LoadoutCalcC> = (args) => <LoadoutCalcC {...args} />

export const LoadoutCalcProspector = Template.bind({})
LoadoutCalcProspector.args = {
  miningLoadout: {
    __typename: 'MiningLoadout',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    loadoutId: '123',
    name: 'My Loadout',
    owner: fakeUser(),
    activeLasers: [
      {
        laser: MiningLaserEnum.ArborMh1,
        modules: [MiningModuleEnum.Brandt],
        __typename: 'ActiveMiningLaserLoadout',
      },
    ],
    inventoryGadgets: [],
    inventorylasers: [],
    inventoryModules: [],
    ship: LoadoutShipEnum.Prospector,
  },
}

export const LoadoutCalcMole = Template.bind({})
LoadoutCalcMole.args = {
  miningLoadout: {
    __typename: 'MiningLoadout',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    loadoutId: '123',
    name: 'My Loadout',
    owner: fakeUser(),
    activeLasers: [
      {
        laser: MiningLaserEnum.ArborMh2,
        modules: [],
        __typename: 'ActiveMiningLaserLoadout',
      },
      {
        laser: MiningLaserEnum.KleinS2,
        modules: [MiningModuleEnum.Brandt],
        __typename: 'ActiveMiningLaserLoadout',
      },
      {
        laser: MiningLaserEnum.HelixIi,
        modules: [MiningModuleEnum.Lifeline, MiningModuleEnum.Fltrxl],
        __typename: 'ActiveMiningLaserLoadout',
      },
    ],
    inventoryGadgets: [],
    inventorylasers: [],
    inventoryModules: [],
    ship: LoadoutShipEnum.Mole,
  },
}
