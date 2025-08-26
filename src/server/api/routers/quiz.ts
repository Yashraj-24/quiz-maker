import { createTRPCRouter, publicProcedure } from '../trpc';
import { z } from "zod";
import { db } from '@/server/db';

export const quizRouter = createTRPCRouter({
  createQuiz: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        subject: z.string().min(1),
        code: z.string().min(1),
        creatorId: z.string().min(1),
        startTime: z.string().datetime(),
        endTime: z.string().datetime(),
        questions: z.array(
          z.object({
            text: z.string().min(1),
            options: z.array(z.string().min(1)).min(2),
            answer: z.string().min(1),
          })
        ).min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Check if quiz code already exists
        const existingQuiz = await ctx.db.quiz.findUnique({
          where: { code: input.code },
        });

        if (existingQuiz) {
          throw new Error("Quiz code already exists");
        }

        const quiz = await ctx.db.quiz.create({
          data: {
            title: input.title,
            subject: input.subject,
            code: input.code,
            creatorId: input.creatorId,
            startTime: new Date(input.startTime),
            endTime: new Date(input.endTime),
            questions: {
              create: input.questions.map(question => ({
                text: question.text,
                options: question.options,
                answer: question.answer,
              })),
            },
          },
          include: {
            questions: true,
          },
        });
        return quiz;
      } catch (error: any) {
        console.error("Error creating quiz:", error);
        throw new Error(error.message || "Failed to create quiz");
      }
    }),
    getQuizCount: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const count = await ctx.db.quiz.count({
          where: {
            creatorId: input.userId,
          },
        });
        return { count };
      } catch (error: any) {
        console.error("Error fetching quiz count:", error);
        throw new Error(error.message || "Failed to fetch quiz count");
      }
    }),
    getRecentQuiz: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const quizzes = await ctx.db.quiz.findMany({
          where: {
            creatorId: input.userId,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        });
        return quizzes;
      } catch (error: any) {
        console.error("Error fetching recent quizzes:", error);
        throw new Error(error.message || "Failed to fetch recent quizzes");
      }
    }
  ),
  getQuizByCode: publicProcedure
    .input(z.object({ code: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      try {
        const quiz = await ctx.db.quiz.findUnique({
          where: { code: input.code },
          include: { questions: true },
        });
        return quiz;
      } catch (error: any) {
        console.error("Error fetching quiz by code:", error);
        throw new Error(error.message || "Failed to fetch quiz by code");
      }
    }),
    getAllQuiz:publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const quizzes = await db.quiz.findMany({
        where: { creatorId: input },
        select: {id:true, title: true, subject:true, startTime: true},
      });
      return quizzes;
    }),
});