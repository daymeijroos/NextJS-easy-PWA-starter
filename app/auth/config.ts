import type { GetServerSidePropsContext } from "next"
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { env } from "../_env/server.mjs"
import { prisma } from "../_database/global"
import type { User } from "@prisma/client"

/**
 * Module augmentation for `next-auth` types
 * Allows us to add custom properties to the `session` object
 * and keep type safety
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure
 * adapters, providers, callbacks, etc.
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.role = (user as User).role ?? 'customer'
      }
      return session
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null
        const user = await prisma.user.findFirst({
          where: {
            username: credentials.username,
          },
        })
        if (user && (user.password !== credentials.password)) return null
        return user
      },
    }),
  ],
}

/**
 * Wrapper for getServerSession so that you don't need
 * to import the authOptions in every file.
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"]
  res: GetServerSidePropsContext["res"]
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions)
}
