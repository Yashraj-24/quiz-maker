import z from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { hash, compare } from 'bcryptjs';
import { db } from '@/server/db';
import jwt from 'jsonwebtoken';
import { serialize, parse } from 'cookie';
import { TRPCError } from '@trpc/server';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dduisdsiuddsuisdnfuisihserewryw3yw78yrwe7ewygfd';
const COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? 'token';

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters long"),
      })
    )
    .mutation(async ({ input }) => {
      const existingUser = await db.user.findUnique({ where: { email: input.email } });
      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Email already in use'
        });
      }

      const hashedPassword = await hash(input.password, 10);
      const user = await db.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
        },
      });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      return {
        success: true,
        user: { id: user.id, name: user.name, email: user.email, token }
      };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      })
    )
    .mutation(async ({ input }) => {
      const { email, password } = input;

      const user = await db.user.findUnique({ where: { email } });
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No account found with this email'
        });
      }

      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Incorrect password'
        });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      return {
        success: true,
        user: { id: user.id, name: user.name, email: user.email, token }
      };
    }),

  logout: publicProcedure
    .mutation(async ({ ctx }) => {
      ctx.res?.setHeader('Set-Cookie', serialize(COOKIE_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0),
        path: '/',
      }));

      return { success: true };
    }),

  getSession: publicProcedure
    .query(async ({ ctx }) => {
      const cookies = parse(ctx.headers.get('cookie') || '');
      const token = cookies[COOKIE_NAME];

      if (!token) {
        return { user: null };
      }

      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

        const user = await db.user.findUnique({
          where: { id: decoded.userId },
          select: { id: true, name: true, email: true, createdAt: true, role: true , bio: true},
        });

        if (!user) {
          return { user: null };
        }

        return { user };
      } catch (error) {
        return { user: null };
      }
    }),
  getUserById: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const user = await db.user.findUnique({
        where: { id: input },
        select: { id: true, email: true, name: true },
      });
      if (!user) throw new Error("User not found");
      return user;
    }),
    getUsernameById: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const user = await db.user.findUnique({
        where: { id: input },
        select: { name: true },
      });
      if (!user) throw new Error("User not found");
      return user.name;
    }),
});