import { promises } from 'fs'

const path = require('path')

export const resolveMetadataOnLocale = async (locale: string) => {
  const file = await promises.readFile(
    path.resolve(__dirname, '../../metadata/stories.json'),
    {
      encoding: 'utf-8',
    },
  )
  const json = JSON.parse(file)
  return json[locale] || []
}
