import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { LoadoutCalc as LoadoutCalcC } from './LoadoutCalc'
import { LoadoutShipEnum, MiningLaserEnum, MiningModuleEnum } from '@regolithco/common'
import { fakeUser } from '@regolithco/common/dist/mock'

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
        laserActive: true,
        modules: [MiningModuleEnum.Brandt, null, null],
        modulesActive: [true, false, false],
        __typename: 'ActiveMiningLaserLoadout',
      },
    ],
    inventoryGadgets: [],
    inventoryLasers: [],
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
        laserActive: true,
        modules: [],
        modulesActive: [false, false, false],
        __typename: 'ActiveMiningLaserLoadout',
      },
      {
        laser: MiningLaserEnum.KleinS2,
        laserActive: true,
        modules: [MiningModuleEnum.Brandt],
        modulesActive: [false, false, false],
        __typename: 'ActiveMiningLaserLoadout',
      },
      {
        laser: MiningLaserEnum.HelixIi,
        laserActive: true,
        modules: [MiningModuleEnum.Lifeline, MiningModuleEnum.Fltrxl],
        modulesActive: [false, false, false],
        __typename: 'ActiveMiningLaserLoadout',
      },
    ],
    inventoryGadgets: [],
    inventoryLasers: [],
    inventoryModules: [],
    activeGadgetIndex: null,
    ship: LoadoutShipEnum.Mole,
  },
}
