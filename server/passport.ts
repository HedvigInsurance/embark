import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth'
import * as passport from 'koa-passport'
import { prisma } from './prisma'

export const passportStart = () => {
  passport.serializeUser(function(user, done) {
    done(null, { id: user.id })
  })

  passport.deserializeUser(async function(user, done) {
    try {
      const prismaUser = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
      })
      done(null, prismaUser)
    } catch (err) {
      done(err)
    }
  })

  passport.use(
    new GoogleStrategy(
      {
        clientID:
          '510523782637-fu29t7uuo7ppcrguotf48r0tk0sidjri.apps.googleusercontent.com',
        clientSecret: 'nQQ3KrurBa6RZNgrA3geIT2P',
        callbackURL:
          'http://localhost:' +
          (process.env.PORT || 3000) +
          '/auth/google/callback',
      },
      async (_, __, profile, done) => {
        const emailContainer = profile.emails[0]
        const email = emailContainer.value

        if (!emailContainer.verified) {
          done(new Error('Email not verified'))
          return
        }

        if (!email.includes('@hedvig.com')) {
          done(new Error('Not approved email'))
          return
        }

        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        })

        if (!user) {
          const newUser = await prisma.user.create({ data: { email: email } })
          done(null, newUser)
        } else {
          done(null, user)
        }
      },
    ),
  )
}
