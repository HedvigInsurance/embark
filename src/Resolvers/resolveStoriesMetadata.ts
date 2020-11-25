import { promises } from 'fs'

export const resolveMetadataOnLocale = async (locale: string) => {
  switch (locale) {
    case 'sv_SE': {
      const file = await promises.readFile(
        'stories-metadata/Swedish - Sweden - Stories.json',
        {
          encoding: 'utf-8',
        },
      )

      const json = JSON.parse(file)
      return json
    }
  }
}
