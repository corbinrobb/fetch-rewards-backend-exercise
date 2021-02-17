exports.seed = function (knex) {
  return knex("payers")
    .truncate()
    .then(function () {
      return knex("payers").insert([
        { id: "DANNON" },
        { id: "UNILEVER" },
        { id: "MILLER COORS" },
      ]);
    });
};
