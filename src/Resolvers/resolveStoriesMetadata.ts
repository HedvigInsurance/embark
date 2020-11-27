import { promises } from 'fs'

const path = require('path')

export const resolveMetadataOnLocale = async (locale: string) => {
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
          return {
            name: json['name'],
            ...metadata,
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
