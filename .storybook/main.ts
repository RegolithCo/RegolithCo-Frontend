import { dirname, join } from 'path'
import { env } from 'process'

export default {
  stories: [ '../src/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@chromatic-com/storybook'),
  ],

  staticDirs: ['../public'],

  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },

  docs: {},

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
}

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')))
}
