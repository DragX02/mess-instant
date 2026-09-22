import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"
import { prisma } from "@/lib/prisma"
import { sendResetPasswordEmail, sendVerificationEmail } from "@/lib/email"

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail(user.email, url)
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail(user.email, url)
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  callbacks: {
    async signUpUser({ user, isNewUser }) {
      // Si c'est une nouvelle création via social, vérifier les doublons d'email
      if (isNewUser && user.email) {
        const existingUser = await prisma.user.findFirst({
          where: {
            email: user.email,
            NOT: { id: user.id },
          },
        })

        if (existingUser) {
          // Transférer le compte social au compte existant
          const socialAccounts = await prisma.account.findMany({
            where: { userId: user.id },
          })

          for (const account of socialAccounts) {
            await prisma.account.update({
              where: { id: account.id },
              data: { userId: existingUser.id },
            })
          }

          // Supprimer l'utilisateur en doublon
          await prisma.user.delete({
            where: { id: user.id },
          })

          // Retourner l'utilisateur existant
          return existingUser
        }
      }

      return user
    },
  },
  plugins: [nextCookies()],
})
