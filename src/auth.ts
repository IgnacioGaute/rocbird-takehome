import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import jwt from 'jsonwebtoken';
import 'next-auth/jwt';
import { loginSchema } from './schema/auth/login.schema';
import {
  createUser,
  getUserByEmail,
  getUserById,
} from './services/user.service';
import { loginUser } from './services/auth.service';

declare module 'next-auth' {
  interface User {
    firstName: string;
    lastName: string;
    accessToken?: string;
    
  }

  interface Session {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    } & DefaultSession['user'];
    token: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    accessToken?: string;
    exp?: number;
  }
}

export const { unstable_update, auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días en segundos
    updateAge: 24 * 60 * 60, // 24 horas en segundos
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text", placeholder: "tuemail@example.com" },
        password: { label: "Contraseña", type: "password" }
      },
      authorize: async (credentials): Promise<any> => {
        if (!credentials) return null;
  
        const validatedFields = loginSchema.safeParse(credentials);
        if (!validatedFields.success) {
          return null;
        }
        const { email, password } = validatedFields.data;
  
        const user: any = await loginUser(
          { email, password },
          process.env.API_SECRET_TOKEN!,
        );
  
        if (!user || !user.id) return null;
  
        return user;
      },
    }),
  ],
  
  callbacks: {
    async signIn({ user, account }): Promise<boolean> {
      try {
        if (account?.provider) {
          const existingUser: any = await getUserByEmail(
            user.email || "",
            process.env.API_SECRET_TOKEN!,
          );

          if (!existingUser) {
            const name = user.name?.split(' ') || [];
            const newUser = await createUser(
              {
                email: user.email || "",
                firstName: name[0],
                lastName: name[1]
              },
              process.env.API_SECRET_TOKEN!,
            );
            if (!newUser) return false;
            user.id = newUser.id;
          } else {
            user.id = existingUser.id;
            user.firstName = existingUser.firstName;
            user.lastName = existingUser.lastName;
          }
          return true;
        }
        if (!user.id) return false;

        const existingUser: any = await getUserById(
          user.id,
          process.env.API_SECRET_TOKEN!,
        );
        return !!(existingUser);
      } catch (error) {
        console.error('Error en signIn callback:', error);
        return false;
      }
    },
    async session({ token, session }) {
      try {
        if (token && token.sub && session.user) {
          session.user = {
            ...session.user,
            id: token.sub,
            email: token.email as string,
            firstName: token.firstName as string,
            lastName: token.lastName as string,
          };
          Object.assign(session, { token: token.accessToken });

        }
        return session;
      } catch (error) {
        console.error('Error en session callback:', error);
        return session;
      }
    },
    async jwt({ token, user, trigger, session }) {
        try {
          if (user) {
            token.sub = user.id;
            token.email = user.email as string;
            token.firstName = user.firstName;
            token.lastName = user.lastName;
            token.accessToken = user.accessToken || token.accessToken;
          }
      
          if (trigger === 'update') {
            token.username = session.user.username;
            token.firstName = session.user.firstName;
            token.lastName = session.user.lastName;
          }
      
          if (!token.exp || Number(token.exp) < Date.now() / 1000) {
            const existingUser = await getUserById(
              token.sub!,
              process.env.API_SECRET_TOKEN!,
            );
            if (!existingUser) return token;
      
            token.accessToken = jwt.sign(
              {
                id: existingUser.id,
                email: existingUser.email,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
              },
              process.env.NEXTAUTH_SECRET!,
              { expiresIn: '30d' },
            );
      
            token.exp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
          }

      
          return token;
        } catch (error) {
          console.error('Error en jwt callback:', error);
          return token;
        }
      },
      
  },
}) satisfies ReturnType<typeof NextAuth>;
