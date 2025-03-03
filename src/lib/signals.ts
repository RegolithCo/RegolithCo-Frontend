import { AsteroidTypeEnum, DepositTypeEnum } from '@regolithco/common'

export const spaceRocks: Record<AsteroidTypeEnum, number> = {
  [AsteroidTypeEnum.Ctype]: 1700,
  [AsteroidTypeEnum.Etype]: 1900,
  [AsteroidTypeEnum.Itype]: 1660,
  [AsteroidTypeEnum.Mtype]: 1850,
  [AsteroidTypeEnum.Ptype]: 1750,
  [AsteroidTypeEnum.Qtype]: 1870,
  [AsteroidTypeEnum.Stype]: 1720,
}

export const depositRocks: Record<DepositTypeEnum, number> = {
  [DepositTypeEnum.Atacamite]: 1800,
  [DepositTypeEnum.Felsic]: 1770,
  [DepositTypeEnum.Gneiss]: 1840,
  [DepositTypeEnum.Granite]: 1920,
  [DepositTypeEnum.Igneous]: 1950,
  [DepositTypeEnum.Obsidian]: 1790,
  [DepositTypeEnum.Quartzite]: 1820,
  [DepositTypeEnum.Shale]: 1730,
}

export const panels: number = 2000

export const ROCGem = 620

export const handGem = 600
