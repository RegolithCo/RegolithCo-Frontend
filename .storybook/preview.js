import log from 'loglevel'

import { ThemeDecorator } from './ThemeDecorator'

export const decorators = [, ThemeDecorator]

export const parameters = {
  // actions: { argTypesRegex: '^on[A-Z].*' },
}

log.setLevel(log.levels.DEBUG)
