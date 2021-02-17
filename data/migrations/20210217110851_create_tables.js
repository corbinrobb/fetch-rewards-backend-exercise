exports.up = function (knex) {
  return (
    knex.schema

      // Payers
      .createTable("payers", (tbl) => {
        tbl.string("id").notNullable().unique().primary();
      })

      // Transactions
      .createTable("transactions", (tbl) => {
        tbl.increments();
        tbl.integer("points").notNullable();
        tbl
          .string("payer")
          .notNullable()
          .references("id")
          .inTable("payers")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        tbl.timestamp("timestamp").defaultTo(knex.fn.now());
      })
  );
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("transactions")
    .dropTableIfExists("payers");
};
