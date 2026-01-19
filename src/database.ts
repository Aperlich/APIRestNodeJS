import { env } from './env/index.js'
import knex from 'knex'         
import type { Knex } from 'knex'

export const config: Knex.Config = {
    client: 'sqlite3',
    connection: {
        filename: env.DATABASE_URL,
    },
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './db/migrations',
    }
}
export const db = knex(config)