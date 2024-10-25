import { useMediaQuery, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'

export const DeviceTypeEnum = {
  PHONE: 'phone',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
} as const
export type DeviceTypeEnum = (typeof DeviceTypeEnum)[keyof typeof DeviceTypeEnum]

export function useDeviceType(): DeviceTypeEnum {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'))

  const [deviceType, setDeviceType] = useState<DeviceTypeEnum>(DeviceTypeEnum.DESKTOP)

  useEffect(() => {
    const userAgent = navigator.userAgent
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    if (/android/i.test(userAgent)) {
      setDeviceType(DeviceTypeEnum.PHONE)
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      setDeviceType(DeviceTypeEnum.PHONE)
    } else if (isTouchDevice && isMediumScreen) {
      setDeviceType(DeviceTypeEnum.TABLET)
    } else if (isSmallScreen) {
      setDeviceType(DeviceTypeEnum.PHONE)
    } else if (isLargeScreen) {
      setDeviceType(DeviceTypeEnum.DESKTOP)
    } else {
      setDeviceType(DeviceTypeEnum.DESKTOP)
    }
  }, [isSmallScreen, isMediumScreen, isLargeScreen])

  return deviceType
}
