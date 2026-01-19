import type { FastifyInstance } from "fastify"
import { db } from "../database.js"
import { z } from "zod"
import { randomUUID } from "node:crypto"
import { checkSessionIdExists } from "../middlewares/check-session-id-exists.js"

export async function transactionRoutes(app: FastifyInstance) {
    app.get('/', {
        preHandler: [checkSessionIdExists],
    }, async (request, reply) => {
        const { sessionId } = request.cookies
        const transactions = await db('transactions').where('session_id', sessionId).select()

        reply.send({ transactions })
    })

    app.get('/:id', {
        preHandler: [checkSessionIdExists],
    }, async (request, reply) => {
        const getTransactionsParseSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = getTransactionsParseSchema.parse(request.params)
        const { sessionId } = request.cookies

        const transactions = await db('transactions')
            .where({
                id,
                session_id: sessionId,
            })
            .first()

        reply.send({ transactions })
    })

    app.get('/summary', {
        preHandler: [checkSessionIdExists],
    }, async (request, reply) => {
        const { sessionId } = request.cookies
        const summary = await db('transactions')
            .sum('amount', { as: 'amount' })
            .where('session_id', sessionId)
            .first()

        reply.send({ summary })
    })

    app.post('/', async (request, reply) => {
        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit']),
        })

        const { title, amount, type } = createTransactionBodySchema.parse(request.body)

        let sessionId = request.cookies.sessionId

        if (!sessionId) {
            sessionId = randomUUID()

            reply.cookie('sessionId', sessionId, {
                path: '/',
                maxAge: 1000 * 60 * 60 * 24 * 7 //7 days
            })
        }

        await db('transactions').insert({
            id: crypto.randomUUID(),
            title,
            amount: type == 'credit' ? amount : amount * -1,
            session_id: sessionId,
        })

        return reply.status(201).send()
    })
}
