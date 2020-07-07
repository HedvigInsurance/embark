import { Store } from '../../KeyValueStore'

export const getMultiActionItems = <T extends {}>(
  store: Store,
  key: string,
  withAdditional: boolean = false,
): { [key: string]: T } =>
  Object.keys(store)
    .filter((storeKey) => storeKey.includes(key))
    .reduce<{ [key: string]: any }>((acc, storeKey) => {
      let matches
      if (withAdditional) {
        matches = /\[([0-9]+)\]([a-zA-Z.]+)$/g.exec(storeKey.replace(key, ''))
      } else {
        matches = /\[([0-9]+)\]([a-zA-Z]+)$/g.exec(storeKey.replace(key, ''))
      }

      if (!matches) {
        return acc
      }

      const index = matches[1]
      const dataKey = matches[2]

      return {
        ...acc,
        [index]: {
          ...(acc[index] ? acc[index] : {}),
          [dataKey]: store[storeKey],
        },
      }
    }, {})
