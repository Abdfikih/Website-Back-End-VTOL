const express = require("express");
const app = express();
const port = 8080;
const cors = require("cors");
const { Pool } = require("pg");

app.use(cors());

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,PATCH,OPTIONS");
  next();
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: true,
});

pool.connect((err, client, done) => {
  if (err) throw err;
  console.log("Connected to database");
});

const client = await pool.connect();

function truncatedTableNode() {
  const query = `TRUNCATE TABLE coordinate`;

  client.query(query, (err, res) => {
    if (err) {
      console.error(err.stack);
    } else {
      console.log("SUCCESFULLY TRUNCATED TABLE");
    }
  });
}

function truncatedTableSum() {
  const query = `TRUNCATE TABLE sum_node`;

  client.query(query, (err, res) => {
    if (err) {
      console.error(err.stack);
    } else {
      console.log("SUCCESFULLY TRUNCATED TABLE");
    }
  });
}

function insertDataNode(node, temperature, humidity, moisture, timestamp) {
  const query = `INSERT INTO sensor_node (node, temperature, humidity, moisture, timestamp) VALUES ($1, $2, $3, $4, $5)`;
  const values = [node, temperature, humidity, moisture, timestamp];

  client.query(query, values, (err, res) => {
    if (err) {
      console.error(err.stack);
    } else {
      console.log("SUCCESFULLY INSERTED DATA NODE");
    }
  });
}

function insertDataCentral(temperature, humidity, pressure, ozone, timestamp) {
  const query = `INSERT INTO sensor_central (temperature, humidity, pressure, ozone, timestamp) VALUES ($1, $2, $3, $4, $5)`;
  const values = [temperature, humidity, pressure, ozone, timestamp];

  client.query(query, values, (err, res) => {
    if (err) {
      console.error(err.stack);
    } else {
      console.log("SUCCESFULLY INSERTED DATA CENTRAL");
    }
  });
}

function insertSumNode(id, angka) {
  const query = `INSERT INTO sum_node (id, angka)
                 VALUES ($1, $2)
                 ON CONFLICT (id) DO UPDATE
                 SET angka = EXCLUDED.angka;`;

  const values = [id, angka];

  client.query(query, values, (err, res) => {
    if (err) {
      console.error(err.stack);
    } else {
      console.log("SUCCESSFULLY INSERTED OR UPDATED SUM NODE");
    }
  });
}

function insertDataCoordinate(node, latitude, longitude, coordinate) {
  const query = `
  INSERT INTO coordinate (node, latitude, longitude, coordinate)
  VALUES ($1, $2, $3, $4)
  ON CONFLICT (node) DO UPDATE
  SET latitude = excluded.latitude,
      longitude = excluded.longitude,
      coordinate = excluded.coordinate
`;

  const values = [node, latitude, longitude, coordinate];

  client.query(query, values, (err, res) => {
    if (err) {
      console.error(err.stack);
    } else {
      console.log("Successfully inserted data into coordinate table");
    }
  });
}

function getUpdatesNode(nodeId, callback) {
  const query = `SELECT * FROM (SELECT *, ROW_NUMBER() OVER (PARTITION BY node ORDER BY id DESC) AS rn FROM sensor_node WHERE node = ${nodeId}) subquery WHERE rn <= 20`;

  client.query(query, (err, result) => {
    if (err) {
      console.error(err);
      callback([]);
    } else {
      const rows = result.rows;
      callback(rows);
    }
  });
}

function getUpdatesCentral(callback) {
  const query = "SELECT * FROM (SELECT *, ROW_NUMBER() OVER (ORDER BY id DESC) AS rn FROM sensor_central) subquery WHERE rn <= 20";

  client.query(query, (err, result) => {
    if (err) {
      console.error(err);
      callback([]);
    } else {
      const rows = result.rows;
      callback(rows);
    }
  });
}

function getUpdatesSumNode(callback) {
  const query = `SELECT * FROM sum_node`;

  client.query(query, (err, res) => {
    if (err) {
      console.error(err);
      callback([]);
    } else {
      const rows = res.rows;
      callback(rows);
    }
  });
}

function getUpdatesCoordinate(node, callback) {
  const query = `SELECT * FROM coordinate WHERE node = $1`;
  const values = [node];

  client.query(query, values, (err, res) => {
    if (err) {
      console.error(err);
      callback([]);
    } else {
      const rows = res.rows;
      callback(rows);
    }
  });
}

app.get("/updatesumnode", async (req, res) => {
  const client = await pool.connect();

  const query = `SELECT * FROM sum_node`;

  console.log("masukkk");

  client.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving sum_node data");
    } else {
      const rows = result.rows;
      res.status(200).send(rows);
    }

    client.release();
  });
});

app.get("/updatecentral", (req, res) => {
  getUpdatesCentral((rows) => {
    res.send(rows);
  });
});

app.get("/updatenode/:nodeId", (req, res) => {
  const { nodeId } = req.params;
  getUpdatesNode(nodeId, (rows) => {
    res.send(rows);
  });
});

app.get("/updatecoordinate/:node", (req, res) => {
  const { node } = req.params;
  getUpdatesCoordinate(node, (rows) => {
    res.send(rows);
  });
});

app.post("/insertsumnode", (req, res) => {
  insertSumNode(req.body.id, req.body.angka);
  res.send("Data sum node inserted into the database");
});

app.post("/resetsum", (req, res) => {
  truncatedTableSum();
  res.send("Truncate Table Sum");
});

app.post("/resetcor", (req, res) => {
  truncatedTableNode();
  res.send("Truncate Table Sum");
});

app.post("/insertnode", (req, res) => {
  insertDataNode(req.body.node, req.body.temperature, req.body.humidity, req.body.moisture, req.body.timestamp);
  res.send("Data node inserted into the database");
});

app.post("/insertcentral", (req, res) => {
  insertDataCentral(req.body.temperature, req.body.humidity, req.body.pressure, req.body.ozone, req.body.timestamp);
  res.send("Data central inserted into the database");
});

app.post("/insertcoordinate", (req, res) => {
  insertDataCoordinate(req.body.node, req.body.latitude, req.body.longitude, req.body.coordinate);
  res.send("Data coordinate inserted into the database");
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
