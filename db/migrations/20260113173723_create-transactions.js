export async function up(knex) {
    await knex.schema.createTable('transactions', (table) => {
        table.uuid('id').primary();
        table.text('title').notNullable();
        table.decimal('amount', 10, 2).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    });
}
export async function down(knex) {
    await knex.schema.dropTable('transactions');
}
//# sourceMappingURL=20260113173723_create-transactions.js.map