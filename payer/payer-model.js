const db = require("../data/dbConfig");

const getPointTotal = async (id) => {
  const data = await db("transactions")
    .where({ payer: id })
    .join("payers", "payers.id", "=", "transactions.payer")
    .select("transactions.points");

  const pointsTotal = data.reduce(
    (total, current) => (total += current.points),
    0
  );

  return pointsTotal;
};

const getAllPointTotals = async () => {
  const payers = await db("payers");

  const payerTotals = {};

  for (const payer of payers) {
    payerTotals[payer.id] = await getPointTotal(payer.id);
  }

  return payerTotals;
};

const getAllTransactionsSorted = async () => {
  return await db("transactions").orderBy("transactions.timestamp");
};

const addTransaction = async (transaction) => {
  const [id] = await db("transactions").insert(transaction);
  return await db("transactions").where({ id });
};

const addPayer = async (payerTitle) => {
  const [id] = await db("payers").insert({ id: payerTitle });

  return await db("payers").where({ id });
};

module.exports = {
  getPointTotal,
  getAllPointTotals,
  getAllTransactionsSorted,
  addTransaction,
  addPayer,
};
