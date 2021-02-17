const data = [
  { payerRefId: "DANNON", points: 1000, timestamp: "2020-11-02T14:00:00Z" },
  { payerRefId: "UNILEVER", points: 200, timestamp: "2020-10-31T11:00:00Z" },
  { payerRefId: "DANNON", points: -200, timestamp: "2020-10-31T15:00:00Z" },
  {
    payerRefId: "MILLER COORS",
    points: 10000,
    timestamp: "2020-11-01T14:00:00Z",
  },
  { payerRefId: "DANNON", points: 300, timestamp: "2020-10-31T10:00:00Z" },
];

const data2 = {
  DANNON: {
    pointsTotal: 1100,
    transactions: [
      { payer: "DANNON", points: 300, timestamp: "2020-10-31T10:00:00Z" },
      { payer: "DANNON", points: -200, timestamp: "2020-10-31T15:00:00Z" },
      { payer: "DANNON", points: 1000, timestamp: "2020-11-02T14:00:00Z" },
    ],
  },
  UNILEVER: {
    pointsTotal: 200,
    transactions: [
      { payer: "UNILEVER", points: 200, timestamp: "2020-10-31T11:00:00Z" },
    ],
  },
  "MILLER COORS": {
    pointsTotal: 10000,
    transactions: [
      {
        payer: "MILLER COORS",
        points: 10000,
        timestamp: "2020-11-01T14:00:00Z",
      },
    ],
  },
};
