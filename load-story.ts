import axios from 'axios'
import { promises } from 'fs'
import { parseStoryData } from './src/Parsing/parseStoryData'

export const loadStory = async (name: string, locale: string) => {
  const dir = await promises.readdir('angel-data')
  const nameAndParameters = name.split('?')
  const nameWithoutParameters = nameAndParameters[0]

  const computedStoreValues =
    nameAndParameters[1]?.split('&').map((param) => {
      const splittedParam = param.split('=')

      return {
        key: splittedParam[0].replace(/\W/g, ''),
        value: `'${splittedParam[1].replace(/\W/g, '')}'`,
      }
    }) || []

  if (!dir.includes(`${nameWithoutParameters}.json`)) {
    throw new Error(`Can't find story with name: ${nameWithoutParameters}`)
  }

  const file = await promises.readFile(
    `angel-data/${nameWithoutParameters}.json`,
    {
      encoding: 'utf-8',
    },
  )

  const json = JSON.parse(file)
  const textKeyMapResponse = await axios.get(
    `https://translations.hedvig.com/embark/${encodeURIComponent(locale)}.json`,
  )

  const parsedStoryData = parseStoryData(json, textKeyMapResponse.data)

  return {
    ...parsedStoryData,
    computedStoreValues: [
      ...computedStoreValues,
      ...(parsedStoryData.computedStoreValues || []),
    ],
  }
}
