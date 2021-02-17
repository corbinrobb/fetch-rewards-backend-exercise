# Fetch Rewards Backend Coding Exercise - Corbin Robb

## Built Using:

- Javascript
- Node
- Express
- Knex
- SQlite3

### Requires:

- Node

[How to install node](https://nodejs.dev/learn/how-to-install-nodejs)

### How To Set Up Locally

- Install node if not already installed

- Fork or clone repository and download locally

- Navigate to root directory in CLI and run `npm install`

- Run `npx knex migrate:latest`

- Make sure PORT 5000 is clear on your machine

- Start the development server by running `npm run dev`

## Might be helpful

### Example Transactions JSON Data

    { "payer": "DANNON", "points": 1000, "timestamp": "2020-11-02T14:00:00Z" }
    { "payer": "UNILEVER", "points": 200, "timestamp": "2020-10-31T11:00:00Z" }
    { "payer": "DANNON", "points": -200, "timestamp": "2020-10-31T15:00:00Z" }
    { "payer": "MILLER COORS", "points": 10000, "timestamp": "2020-11-01T14:00:00Z" }
    { "payer": "DANNON", "points": 300, "timestamp": "2020-10-31T10:00:00Z" }

### Optional

- Run `npx knex seed:run` to seed the database with the exact same data as above
- Truncates the table so you will lose any transactions you have added

## Routes Documentation

#### Payer Schema

---

```js
{
  id: STRING, // primary key
}
```

---

#### Transaction Schema

---

```js
{
  id: INTEGER, // added by database - primary key
  payer: STRING, // required - Refers to payer id in Payers table
  points: INTEGER, // required
  timestamp: DATE // Defaults to now if not provided
}
```

---

#### Routes

---

- GET `/api/points/`

  - Returns payer names and point values

  #### Example Response

  ```js
  {
    "DANNON": 1100,
    "UNILEVER": 200,
    "MILLER COORS": 10000
  }

  ```

---

- GET `/api/transactions/`

  - Returns list of all transactions sorted by timestamp

  #### Example Response

  ```js
  [
    {
      id: 2,
      points: 200,
      payer: "UNILEVER",
      timestamp: "2020-10-31T11:00:00Z",
    },
    {
      id: 3,
      points: -200,
      payer: "DANNON",
      timestamp: "2020-10-31T11:00:00Z",
    },
    {
      id: 5,
      points: 300,
      payer: "DANNON",
      timestamp: "2020-10-31T11:00:00Z",
    },
    {
      id: 4,
      points: 10000,
      payer: "MILLER COORS",
      timestamp: "2020-11-01T14:00:00Z",
    },
    {
      id: 1,
      points: 1000,
      payer: "DANNON",
      timestamp: "2020-11-02T14:00:00Z",
    },
  ];
  ```

---

- POST `/api/points/`

  - Spends points

  #### Example Request Body

  ```js
  {
   "points" 5000
  }

  ```

  #### Example Response

  ```js
  [
    {
      payer: "UNILEVER",
      points: -200,
    },
    {
      payer: "DANNON",
      points: -100,
    },
    {
      payer: "MILLER COORS",
      points: -4700,
    },
  ];
  ```

  #### Errors

  - `400` Bad Request
    - Missing points value
    - Points value is negative or zero
    - Trying to spend more points than are available

---

- POST `/api/transactions/`

  - Create a new transaction
  - Timestamp value optional - defaults to now if it is left off

  #### Example Request Body

  ```js
  {
    "payer": "BILLS LIVE EELS",
    "points": 2000,
    "timestamp": "2020-11-06T14:00:00Z"
  }
  ```

  #### Example Response

  ```js
  {
    "id": 6,
    "points": 2000,
    "payer": "BILLS LIVE EELS",
    "timestamp": "2020-11-06T14:00:00Z"
  }
  ```

  #### Errors

  - `400` Bad Request
    - Missing points or payer values
    - Points value makes payer point total a negative value

---
