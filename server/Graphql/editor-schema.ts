import { makeExecutableSchema } from 'graphql-tools'
import { prisma } from '../prisma'
import { nexusPrisma } from 'nexus-plugin-prisma'
import {
  makeSchema,
  queryType,
  mutationType,
  objectType,
  definition,
} from 'nexus'

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1)
}

export const schema = makeSchema({
  types: [
    queryType({
      definition(t) {
        Object.keys(t.crud).forEach((key) => {
          t.crud[key]()
        })
      },
    }),
    mutationType({
      definition(t) {
        Object.keys(t.crud).forEach((key) => {
          t.crud[key]()
        })
      },
    }),
    Object.keys(prisma)
      .filter((key) => !key.includes('_'))
      .map((model) =>
        objectType({
          name: capitalize(model),
          definition(t) {
            Object.keys(t.model).forEach((key) => {
              t.model[key]()
            })
          },
        }),
      ),
  ],
  plugins: [
    nexusPrisma({
      experimentalCRUD: true,
    }),
  ],
})
