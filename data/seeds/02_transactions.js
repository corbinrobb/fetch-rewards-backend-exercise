exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("transactions")
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex("transactions").insert([
        { points: 1000, payer: "DANNON", timestamp: "2020-11-02T14:00:00Z" },
        { points: 200, payer: "UNILEVER", timestamp: "2020-10-31T11:00:00Z" },
        { points: -200, payer: "DANNON", timestamp: "2020-10-31T11:00:00Z" },
        {
          points: 10000,
          payer: "MILLER COORS",
          timestamp: "22020-11-01T14:00:00Z",
        },
        { points: 300, payer: "DANNON", timestamp: "2020-10-31T11:00:00Z" },
      ]);
    });
};
