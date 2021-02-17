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

const updateTransactionPoints = async (points, id) => {
  await db("transactions").where({ id }).update({ points });
  return await db("transactions").where({ id });
};

const removeTransaction = async (id) => {
  const transaction = await db("transactions").where({ id });
  await db("transactions").where({ id }).del();
  return transaction;
};

const addPayer = async (payerTitle) => {
  const [id] = await db("payers").insert({ id: payerTitle });

  return await db("payers").where({ id });
};

const spendPoints = async (pointsToSpend) => {
  const sortedTransactions = await getAllTransactionsSorted();

  const spentTransactions = {};

  for (const transaction of sortedTransactions) {
    if (pointsToSpend >= transaction.points) {
      pointsToSpend += -transaction.points;
      if (transaction.payer in spentTransactions) {
        spentTransactions[transaction.payer] =
          spentTransactions[transaction.payer] - transaction.points;
      } else {
        spentTransactions[transaction.payer] = -transaction.points;
      }
      await removeTransaction(transaction.id);
    } else {
      if (transaction.payer in spentTransactions) {
        spentTransactions[transaction.payer] =
          spentTransactions[transaction.payer] - pointsToSpend;
      } else {
        spentTransactions[transaction.payer] = -pointsToSpend;
      }
      await updateTransactionPoints(
        transaction.points - pointsToSpend,
        transaction.id
      );
      pointsToSpend = 0;
      break;
    }
  }

  const arrayFromObject = Object.entries(spentTransactions).map(
    ([payer, points]) => {
      return { payer, points };
    }
  );

  return arrayFromObject;
};

module.exports = {
  getPointTotal,
  getAllPointTotals,
  getAllTransactionsSorted,
  addTransaction,
  updateTransactionPoints,
  addPayer,
  spendPoints,
};
