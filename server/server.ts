import * as Koa from 'koa'
import * as fs from 'fs'
import * as Router from 'koa-router'
import * as serve from 'koa-static'
import * as mount from 'koa-mount'
import * as cors from '@koa/cors'
import * as session from 'koa-session'
import * as passport from 'koa-passport'
import { JSDOM } from 'jsdom'
import { passportStart } from './passport'
import * as graphqlHTTP from 'koa-graphql'

import { schema as publicSchema } from './Graphql/public-schema'
import { schema as editorSchema } from './Graphql/editor-schema'
import { loadStory } from './load-story'
import { prisma } from './prisma'

declare global {
  namespace NodeJS {
    interface Global {
      document: JSDOM
    }
  }
}

;(global as any).document = new JSDOM('<html></html>').window.document

const app = new Koa()
app.use(cors())
app.use(mount('/assets', serve(__dirname + '/src/Assets')))

app.keys = ['secret']
app.use(session({}, app))

passportStart()

app.use(passport.initialize())
app.use(passport.session())

const serveIndex = async (ctx: any) => {
  const html = fs.readFileSync('server/index.html', 'utf-8')
  ctx.type = 'text/html; charset=UTF-8'
  ctx.body = html
}

const publicRouter = new Router()
publicRouter.get(
  '/',
  (ctx, next) => {
    if (ctx.isAuthenticated()) {
      ctx.redirect('/editor')
    } else {
      next()
    }
  },
  serveIndex,
)

publicRouter.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  }),
)

publicRouter.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/failure' }),
  (ctx) => {
    ctx.redirect('/editor')
  },
)

publicRouter.all(
  '/graphql',
  graphqlHTTP({
    schema: publicSchema,
    graphiql: true,
  }),
)

publicRouter.get('/angel-data', async (ctx) => {
  const name = ctx.request.query.name
  const locale = ctx.query.locale || 'en'
  ctx.type = 'application/json'
  const data = await loadStory(decodeURIComponent(name), locale)
  ctx.body = JSON.stringify(data)
})

publicRouter.get('/editor.js', async (ctx) => {
  const javascript = fs.readFileSync('dist/main.js', 'utf-8')
  ctx.type = 'application/javascript'
  ctx.body = javascript
})

publicRouter.get('/health', async (ctx) => {
  ctx.body = { status: 'ok' }
})

app.use(publicRouter.routes()).use(publicRouter.allowedMethods())

const securedRouter = new Router()

app.use(async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    await next()
  } else {
    ctx.body = 'access denied'
    ctx.status = 401
  }
})

app.use(async (ctx, next) => {
  ctx.prisma = prisma
  await next()
})

securedRouter.all(
  '/editor-graphql',
  graphqlHTTP({
    schema: editorSchema,
    graphiql: true,
  }),
)

securedRouter.get('/editor(.*)', serveIndex)

app.use(securedRouter.routes()).use(securedRouter.allowedMethods())

const port = process.env.PORT ? process.env.PORT : 3000
app.listen(port)

console.log(`server started at port ${port}`)
