import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { ScoutingFindCalc, ScoutingFindCalcProps } from './ScoutingFindCalc'
import { mock } from '@regolithco/common'
import { ScoutingFindTypeEnum } from '@regolithco/common'

export default {
  title: 'Calculators/ScoutingFind',
  component: ScoutingFindCalc,
  parameters: {
    findType: {
      control: {
        type: 'select',
        options: Object.values(ScoutingFindTypeEnum),
      },
    },
  },
} as Meta<typeof ScoutingFindCalc>

const Template: StoryFn<typeof ScoutingFindCalc> = (args: ScoutingFindCalcProps) => {
  const { findType, ...props } = args as ScoutingFindCalcProps & { findType: ScoutingFindTypeEnum }
  switch (findType) {
    case ScoutingFindTypeEnum.Ship:
      props.scoutingFind = mock.fakeShipClusterFind()
      break
    case ScoutingFindTypeEnum.Vehicle:
      props.scoutingFind = mock.fakeVehicleClusterFind()
      break
    case ScoutingFindTypeEnum.Salvage:
      props.scoutingFind = mock.fakeSalvageFind()
      break
  }

  return <ScoutingFindCalc {...props} />
}

export const New = Template.bind({})
New.args = {
  scoutingFind: mock.fakeShipClusterFind(),
  me: mock.fakeSessionUser(),
}

export const Scout = Template.bind({})
Scout.args = {
  scoutingFind: mock.fakeShipClusterFind(),
  me: mock.fakeSessionUser(),
}

export const Observer = Template.bind({})
Observer.args = {
  scoutingFind: mock.fakeShipClusterFind(),
  me: mock.fakeSessionUser(),
}
