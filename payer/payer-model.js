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
    // Check if pointsToSpend is greater than or equal to transaction points
    if (pointsToSpend >= transaction.points) {
      pointsToSpend += -transaction.points;

      // Add payer and points spent values to spentTransactions
      if (transaction.payer in spentTransactions) {
        spentTransactions[transaction.payer] =
          spentTransactions[transaction.payer] - transaction.points;
      } else {
        spentTransactions[transaction.payer] = -transaction.points;
      }

      // Remove Transaction because all points were spent
      await removeTransaction(transaction.id);

      // Runs when transaction points wont be entirely taken up by pointsToSpend
    } else {
      // Add payer and points spent values to spentTransactions
      if (transaction.payer in spentTransactions) {
        spentTransactions[transaction.payer] =
          spentTransactions[transaction.payer] - pointsToSpend;
      } else {
        spentTransactions[transaction.payer] = -pointsToSpend;
      }

      // Updates transaction in database to reflect points spent
      await updateTransactionPoints(
        transaction.points - pointsToSpend,
        transaction.id
      );

      // Update points to spend and end loop
      pointsToSpend = 0;
      break;
    }
  }

  // Turns spentTransactions object into array of objects
  const arrayFromObject = Object.entries(spentTransactions).map(
    ([payer, points]) => {
      return { payer, points };
    }
  );

  // Return final array
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
