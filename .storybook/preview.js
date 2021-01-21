import { Global } from '@emotion/core'
import { colorsV3 } from '@hedviginsurance/brand'
import { globalStylesStorybook } from './globalStyles'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  backgrounds: {
    default: 'gray900',
    values: [
      {
        name: 'gray900',
        value: colorsV3.gray900,
      },
      {
        name: 'gray100',
        value: colorsV3.gray100,
      },
    ],
  },
}

export const decorators = [
  (story) => (
    <>
      <Global styles={globalStylesStorybook} />
      {story()}
    </>
  ),
]
