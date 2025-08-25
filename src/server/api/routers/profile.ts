import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'
import { db } from '@/server/db'
import { TRPCError } from '@trpc/server'
import { parse } from 'cookie'
import jwt from 'jsonwebtoken'

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? 'token'
const JWT_SECRET = process.env.JWT_SECRET ?? 'dduisdsiuddsuisdnfuisihserewryw3yw78yrwe7ewygfd'

export const profileRouter = createTRPCRouter({
    getProfile: publicProcedure.query(async ({ ctx }) => {
        const cookies = parse(ctx.headers.get('cookie') || '');
        const token = cookies[COOKIE_NAME];

        if (!token) {
            return { user: null };
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
            return await db.user.findUnique({
                where: { id: decoded.userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    // image: true,
                    role: true,
                    bio: true,
                    createdAt: true
                }
            });
        } catch (error) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Invalid or expired token'
            });
        }
    }),

    updateProfile: publicProcedure
        .input(
            z.object({
                name: z.string().min(1, "Name is required"),
                role: z.string().optional(),
                bio: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const cookies = parse(ctx.headers.get('cookie') || '');
            const token = cookies[COOKIE_NAME];

            if (!token) {
                return { user: null };
            }
            try {
                const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
                const updatedUser = await db.user.update({
                    where: { id: decoded.userId },
                    data: {
                        name: input.name,
                        role: input.role,
                        bio: input.bio,
                    },
                })

                return {
                    success: true,
                    user: updatedUser
                }
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to update profile'
                })
            }
        }),

    // uploadProfilePicture: protectedProcedure
    //     .input(z.object({ imageUrl: z.string().url() }))
    //     .mutation(async ({ ctx, input }) => {
    //         try {
    //             const updatedUser = await db.user.update({
    //                 where: { id: ctx.session.user.id },
    //                 data: { image: input.imageUrl }
    //             })

    //             return {
    //                 success: true,
    //                 imageUrl: updatedUser.image
    //             }
    //         } catch (error) {
    //             throw new TRPCError({
    //                 code: 'INTERNAL_SERVER_ERROR',
    //                 message: 'Failed to update profile picture'
    //             })
    //         }
    //     })
});