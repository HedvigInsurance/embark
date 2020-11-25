import { promises } from 'fs'

export const resolveMetadataOnLocale = async (locale: string) => {
  const file = await promises.readFile('metadata/stories.json', {
    encoding: 'utf-8',
  })
  const json = JSON.parse(file)
  return json[locale] || []
}
