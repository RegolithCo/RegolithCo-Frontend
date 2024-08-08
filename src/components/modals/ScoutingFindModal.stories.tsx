import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { ScoutingFindModal as ScoutingFindModalC, ScoutingFindModalProps } from './ScoutingFindModal'
import {
  fakeSalvageFind,
  fakeSessionUser,
  fakeShipClusterFind,
  fakeVehicleClusterFind,
} from '@regolithco/common/dist/mock'
// import log from 'loglevel'
import { ScoutingFind, ScoutingFindTypeEnum } from '@regolithco/common'
import {
  ScoutingFindContext,
  scoutingFindContextDefault,
  ScoutingFindContextType,
} from '../../context/scoutingFind.context'

export default {
  title: 'Modals/ScoutingFindModal',
  component: ScoutingFindModalC,
  argTypes: {
    scoutingFindType: {
      control: {
        type: 'select',
        options: Object.values(ScoutingFindTypeEnum),
        default: ScoutingFindTypeEnum.Ship,
      },
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof ScoutingFindModalC>

interface TemplateProps {
  scoutingFindType: ScoutingFindTypeEnum
  componentProps: Partial<ScoutingFindModalProps>
  contextProps: Partial<ScoutingFindContextType>
}

const Template: StoryFn<TemplateProps> = ({ scoutingFindType, componentProps, contextProps }: TemplateProps) => {
  let scoutingFind: ScoutingFind
  switch (scoutingFindType) {
    case ScoutingFindTypeEnum.Ship:
      scoutingFind = fakeShipClusterFind()
      break
    case ScoutingFindTypeEnum.Vehicle:
      scoutingFind = fakeVehicleClusterFind()
      break
    case ScoutingFindTypeEnum.Salvage:
      scoutingFind = fakeSalvageFind()
      break
    default:
      return <div>Activity is required</div>
  }
  return (
    <ScoutingFindContext.Provider
      value={{
        ...scoutingFindContextDefault,
        ...contextProps,
        scoutingFind,
      }}
    >
      <ScoutingFindModalC
        {...componentProps}
        open
        onClose={() => {
          console.log('Closed')
        }}
      />
    </ScoutingFindContext.Provider>
  )
}

export const Create = Template.bind({})
Create.args = {
  contextProps: {
    isNew: true,
    allowEdit: true,
    meUser: fakeSessionUser(),
  },
}

export const Edit = Template.bind({})
Edit.args = {
  contextProps: {
    isNew: false,
    allowEdit: true,
    meUser: fakeSessionUser(),
  },
}

export const View = Template.bind({})
View.args = {
  contextProps: {
    isNew: false,
    allowEdit: false,
    meUser: fakeSessionUser(),
  },
}
