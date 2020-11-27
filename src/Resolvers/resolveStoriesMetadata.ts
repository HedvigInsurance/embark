import { promises } from 'fs'

const path = require('path')

type TextKeyObject = Record<string, string>

export const resolveMetadataOnLocale = async (
  locale: string,
  textKeyMap: TextKeyObject,
) => {
  const dirs = await promises.readdir(
    path.resolve(__dirname, '../../angel-data'),
    {
      encoding: 'utf-8',
    },
  )

  const metadatas = await Promise.all(
    dirs.map(async (name) => {
      const file = await promises.readFile(
        path.resolve(__dirname, `../../angel-data/${name}`),
        {
          encoding: 'utf-8',
        },
      )

      const json = JSON.parse(file)

      if (json['locales'] && json['locales'].includes(locale)) {
        return json['metadata'].map((metadata: any) => {
          //const mappedInnerMetadata = metadata['metadata'] || metadata['metadata'] === []
          //   ? []
          //   : metadata['metadata'].map((innerMetadata: any) => {
          //     innerMetadata['__typename'] ===
          //     'EmbarkStoryMetadataEntryDiscount'
          //       ? {
          //         __typename: innerMetadata['__typename'],
          //         discount: textKeyMap[innerMetadata['discount']],
          //       }
          //       : []
          //   })

          return {
            name: json['name'],
            title: textKeyMap[metadata['title']]
              ? textKeyMap[metadata['title']]
              : metadata['title'],
            description: textKeyMap[metadata['description']]
              ? textKeyMap[metadata['description']]
              : metadata['description'],
            type: metadata['type'],
            metadata: [],
          }
        })
      } else {
        return []
      }
    }),
  )

  return metadatas.reduce((acc, innerMetadatas) => {
    return [...acc, ...innerMetadatas]
  }, [])
}
