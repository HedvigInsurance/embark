import { promises } from 'fs'

const path = require('path')

export const resolveMetadataOnLocale = async (locale: string) => {
  var output = JSON.parse('[]')

  const dirs = await promises.readdir(
    path.resolve(__dirname, '../../angel-data'),
    {
      encoding: 'utf-8',
    },
  )

  await Promise.all(
    dirs.map(async (name) => {
      const file = await promises.readFile(
        path.resolve(__dirname, `../../angel-data/${name}`),
        {
          encoding: 'utf-8',
        },
      )

      const json = JSON.parse(file)

      if (json['locale'] == locale) {
        json['metadata'].map((metadata: any) => {
          output.push({
            name: json['name'],
            ...metadata,
          })
        })
      }
    }),
  )
  return output
}
