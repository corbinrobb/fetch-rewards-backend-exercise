const router = require("express").Router();
const Payers = require("./payer-model");
const { verifyTransaction, verifyPoints } = require("../middleware");

router.get("/points", async (req, res) => {
  try {
    const points = await Payers.getAllPointTotals();
    res.status(200).json(points);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Couldn't retrieve data from the database" });
  }
});

router.get("/transactions", async (req, res) => {
  try {
    const sortedTransactions = await Payers.getAllTransactionsSorted();
    res.status(200).json(sortedTransactions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Couldn't retrieve data from the database" });
  }
});

router.post("/transactions", verifyTransaction, async (req, res) => {
  const transaction = req.transaction;

  try {
    const [addedTransaction] = await Payers.addTransaction(transaction);
    res.status(201).json(addedTransaction);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Couldn't retrieve data from the database" });
  }
});

router.post("/points", verifyPoints, async (req, res) => {
  const pointsToSpend = req.body.points;

  try {
    const pointsSpent = await Payers.spendPoints(pointsToSpend);
    res.status(200).json(pointsSpent);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Couldn't retrieve data from the database" });
  }
});

module.exports = router;
