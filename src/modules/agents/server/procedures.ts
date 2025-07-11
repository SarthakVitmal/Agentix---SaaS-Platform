import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { db } from '@/db';
import { agents } from '@/db/schema';
import { agentInsertSchema, agentUpdateSchema } from '../schema';
import { z } from 'zod';
import { eq, getTableColumns, sql, and, ilike, desc, count } from 'drizzle-orm';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from '@/constants';
import { TRPCError } from '@trpc/server';

export const agentsRouter = createTRPCRouter({
    update: protectedProcedure.input(agentUpdateSchema).mutation(async ({ input, ctx }) => {
        const [updatedAgent] = await db
            .update(agents)
            .set(input)
            .where(and(
                eq(agents.id, input.id),
                eq(agents.userId, ctx.auth.user.id)
            ))
            .returning();
        if (!updatedAgent) {
            throw new TRPCError({
                code: 'NOT_FOUND', message: 'Agent not found'
            });
        }
        return updatedAgent;
    }),
    remove: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
        const { id } = input;
        const { auth } = ctx;
        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(and(
                eq(agents.id, id),
                eq(agents.userId, auth.user.id)
            ));
        if (!existingAgent) {
            throw new TRPCError({
                code: 'NOT_FOUND', message: 'Agent not found'
            });
        }
        await db
            .delete(agents)
            .where(eq(agents.id, id));
        return existingAgent;
    }),
    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
        const [existingAgent] = await db
            .select({
                meetingCount: sql<number>`5`,
                ...getTableColumns(agents),
            })
            .from(agents)
            .where(and(
                eq(agents.id, input.id),
                eq(agents.userId, ctx.auth.user.id)
            ),);
        if (!existingAgent) {
            throw new TRPCError({
                code: 'NOT_FOUND', message:'Agent not found'})
        }
        return existingAgent;
    }),
    getMany: protectedProcedure
        .input(z.object({
            page: z.number().default(DEFAULT_PAGE),
            pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
            search: z.string().nullish(),
        }))
        .query(async ({ ctx, input }) => {
            const { page, pageSize, search } = input;
            const data = await db
                .select({
                    meetingCount: sql<number>`5`,
                    ...getTableColumns(agents),
                }
                )
                .from(agents)
                .where(
                    and(
                        eq(agents.userId, ctx.auth.user.id),
                        search ? ilike(agents.name, `%${search}%`) : undefined
                    )
                )
                .orderBy(desc(agents.createdAt), desc(agents.id))
                .limit(pageSize)
                .offset((page - 1) * pageSize);

            const [total] = await db
                .select({ count: count(agents.id) })
                .from(agents)
                .where(
                    and(
                        eq(agents.userId, ctx.auth.user.id),
                        search ? ilike(agents.name, `%${search}%`) : undefined
                    )
                )
            const totalPages = Math.ceil(total.count / pageSize);
            return {
                item: data,
                total: total.count,
                totalPages,
            }
        }),
    create: protectedProcedure.input(agentInsertSchema)
        .mutation(async ({ input, ctx }) => {
            const { name, instructions } = input;
            const { auth } = ctx;
            const [createdAgent] = await db
                .insert(agents)
                .values({
                    name,
                    instructions,
                    userId: auth.user.id,
                })
                .returning();
            return createdAgent;
        }),
})