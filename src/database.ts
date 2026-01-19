import { env } from './env/index.js'
import knex from 'knex'         
import type { Knex } from 'knex'

export const config: Knex.Config = {
    client: env.DATABASE_CLIENT,
    connection: env.DATABASE_CLIENT == 'sqlite' ? {
        filename: env.DATABASE_URL
    } : env.DATABASE_URL,
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './db/migrations',
    }
}
export const db = knex(config)