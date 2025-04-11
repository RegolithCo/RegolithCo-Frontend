import React from 'react'

import { AppContext, AppContextType } from '../context/app.context'

const mockAppContext: AppContextType = {
  hideNames: false,
  setHideNames: () => {},
  getSafeName: (scName?: string) => scName || 'UNNAMEDUSER',
}

export const AppContextMock: React.FC<React.PropsWithChildren & { value?: Partial<AppContextType> }> = ({
  value,
  children,
}) => {
  return <AppContext.Provider value={{ ...mockAppContext, ...value }}>{children}</AppContext.Provider>
}
