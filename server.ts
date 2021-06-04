import * as Koa from 'koa'
import * as fs from 'fs'
import * as Router from 'koa-router'
import * as serve from 'koa-static'
import * as mount from 'koa-mount'
import * as cors from '@koa/cors'
import { JSDOM } from 'jsdom'
import { storyKeywords } from './src/storyKeywords'
import { storyMaskDerivatives } from './src/storyMaskDerivatives'
import * as graphqlHTTP from 'koa-graphql'

import { schema } from './schema'
import { loadStory } from './load-story'

declare global {
  namespace NodeJS {
    interface Global {
      document: JSDOM
    }
  }
}

;(global as any).document = new JSDOM('<html></html>').window.document

const app = new Koa()
const router = new Router()
app.use(cors())
app.use(mount('/assets', serve(__dirname + '/src/Assets')))

app.use(
  mount(
    '/graphql',
    graphqlHTTP({
      schema,
      graphiql: true,
    }),
  ),
)

router.get('/client.js', async (ctx) => {
  const javascript = fs.readFileSync('dist/main.js', 'utf-8')
  ctx.type = 'application/javascript'
  ctx.body = javascript
})

router.get('/angel-data', async (ctx) => {
  const name = ctx.request.query.name
  const locale = ctx.query.locale || 'en'
  ctx.type = 'application/json'
  const data = await loadStory(decodeURIComponent(name), locale)
  ctx.body = JSON.stringify(data)
})

const scriptHost = process.env.SCRIPT_HOST
  ? process.env.SCRIPT_HOST
  : 'http://localhost:3000'

router.get('/format.js', async (ctx) => {
  const proofing = ctx.request.query.proofing
  const isProofing = Boolean(proofing)

  const raw = await fs.promises.readFile('src/story-format.html', 'utf-8')
  const html = raw
    .replace(/{{SCRIPT_HOST}}/g, scriptHost)
    .replace(/{{IS_PROOFING}}/g, String(isProofing))

  const outputJSON = {
    name: 'Hedvig Twine',
    version: '1.0.0',
    author: 'Hedvig',
    description: '',
    proofing: isProofing,
    source: html,
    storyKeywords,
    storyMaskDerivatives,
  }

  const outputString =
    'window.storyFormat(' + JSON.stringify(outputJSON, null, 2) + ');'

  ctx.type = 'html'
  ctx.body = outputString
})

router.get('/health', async (ctx) => {
  ctx.body = { status: 'ok' }
})

app.use(router.middleware())

const port = process.env.PORT ? process.env.PORT : 3000
app.listen(port)

console.log(`server started at port ${port}`)
