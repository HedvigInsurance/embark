import { promises } from 'fs'

const path = require('path')

type TextKeyObject = Record<string, string>

interface Metadata {
  subType: string
  name: string
  title: string
  description: string
  type: string
  metadata: []
}

export const resolveMetadataOnLocale = async (
  locale: string,
  textKeyMap: TextKeyObject,
): Promise<Metadata> => {
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

      if (json.locales?.includes(locale)) {
        return json.metadata.map((metadata: Metadata) => {
          const innerMappedMetadata = metadata.metadata.map(
            (innerMetadata: any) => {
              if (
                innerMetadata.__typename == 'EmbarkStoryMetadataEntryDiscount'
              ) {
                return {
                  discount: textKeyMap[innerMetadata.discount]
                    ? textKeyMap[innerMetadata.discount]
                    : innerMetadata.discount,
                  __typename: innerMetadata.__typename,
                }
              } else {
                return {
                  ...innerMetadata,
                }
              }
            },
          )

          return {
            name: json.name,
            title: textKeyMap[metadata.title]
              ? textKeyMap[metadata.title]
              : metadata.title,
            description: textKeyMap[metadata.description]
              ? textKeyMap[metadata.description]
              : metadata.description,
            type: metadata.type,
            subType: metadata.subType,
            metadata: innerMappedMetadata,
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
