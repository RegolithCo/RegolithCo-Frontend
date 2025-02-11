import React from 'react'

import { AppContext, AppContextType } from '../context/app.context'
import { fakeUserProfile } from '@regolithco/common/dist/__mocks__'

const mockAppContext: AppContextType = {
  hideNames: false,
  setHideNames: () => {},
  getSafeName: (scName?: string) => scName || 'UNNAMEDUSER',
  myUserProfile: fakeUserProfile(),
}

export const AppContextMock: React.FC<React.PropsWithChildren & { value?: Partial<AppContextType> }> = ({
  value,
  children,
}) => {
  return <AppContext.Provider value={{ ...mockAppContext, ...value }}>{children}</AppContext.Provider>
}
