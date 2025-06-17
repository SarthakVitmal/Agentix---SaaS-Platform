import {createTRPCRouter, protectedProcedure} from '@/trpc/init';
import {db} from '@/db';
import {agents} from '@/db/schema';
import {agentInsertSchema} from '../schema';
import {z} from 'zod';
import {eq, getTableColumns, sql} from 'drizzle-orm';

export const agentsRouter = createTRPCRouter({
    getOne: protectedProcedure.input(z.object({id: z.string()})).query(async({input}) => {
        const [existingAgent] = await db 
        .select({
            meetingCount: sql<number>`5`,
            ...getTableColumns(agents),
        })
        .from(agents)
        .where(eq(agents.id,input.id));
        return existingAgent;
    }),
    getMany: protectedProcedure.query(async() => {
        const data = await db 
        .select({
            meetingCount: sql<number>`5`,
            ...getTableColumns(agents),
        }
        )
        .from(agents);
        return data;
    }),
    create: protectedProcedure.input(agentInsertSchema)
    .mutation(async({input, ctx}) => {
        const {name, instructions } = input;
        const {auth} = ctx;
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