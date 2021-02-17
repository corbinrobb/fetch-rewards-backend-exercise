const Payers = require("../payer/payer-model");

const verifyTransaction = async (req, res, next) => {
  const { payer, points, timestamp } = req.body;

  const payersWithTotals = await Payers.getAllPointTotals();

  if (!payer || !points) {
    return res.status(400).json({
      error: "Transaction body must include a payer value and a points value",
    });
  }

  if (!(payer in payersWithTotals)) {
    await Payers.addPayer(payer);
  }

  if (payersWithTotals[payer] + points < 0) {
    return res.status(400).json({
      error: "Points in transaction must not make payer total a negative value",
    });
  }

  if (!timestamp) {
    req.transaction = { payer, points };
  } else {
    req.transaction = { payer, points, timestamp };
  }

  next();
};

const verifyPoints = async (req, res, next) => {
  const pointsToSpend = req.body.points;

  if (!pointsToSpend || pointsToSpend < 0) {
    return res
      .status(400)
      .json({ error: "Points value must exist and be greater than 0" });
  }

  if (Math.round(pointsToSpend) !== pointsToSpend) {
    return res
      .status(400)
      .json({ error: "Points value must be a whole number" });
  }

  const pointTotals = await Payers.getAllPointTotals();

  const allPoints = Object.values(pointTotals).reduce(
    (total, current) => (total += current),
    0
  );

  if (pointsToSpend > allPoints) {
    return res
      .status(400)
      .json({ error: "Can't spend more points than are available" });
  }

  next();
};

module.exports = {
  verifyTransaction,
  verifyPoints,
};
