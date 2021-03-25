import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql";

import postRoutes from "./routes/posts.js";

const app = experess();

app.use("/posts", postRoutes); //after starting the app try: http://localhost:<your port number>/posts

//dependencies for the basic app to further develop with features
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

/*

BEFORE GOING THROUGH THE DB CODE, REFER THESE DOCS ONLINE:

>> Creating MySQL DB in Azure: https://docs.microsoft.com/en-us/azure/mysql/quickstart-create-mysql-server-database-using-azure-portal
>> Connecting Azure MySQL DB with NodeJS application: https://docs.microsoft.com/en-us/azure/mysql/connect-nodejs

*/

// Create DB connection
var config = {
  host: "<mydemoserver.mysql.database.azure.com>",
  user: "<myadmin@mydemoserver>",
  password: "<your_password>",
  database: "<quickstartdb>",
  port: 3306,
  ssl: true,
};

// Connect
const conn = new mysql.createConnection(config);

conn.connect(function (err) {
  if (err) {
    console.log("!!! Cannot connect !!! Error:");
    throw err;
  } else {
    console.log("Connection established.");
    queryDatabase();
  }
});

// Create DB
function queryDatabase() {
  //edit values for the string values as per our db

  conn.query(
    "DROP TABLE IF EXISTS inventory;",
    function (err, results, fields) {
      if (err) throw err;
      console.log("Dropped inventory table if existed.");
    }
  );
  conn.query(
    "CREATE TABLE inventory (id serial PRIMARY KEY, name VARCHAR(50), quantity INTEGER);",
    function (err, results, fields) {
      if (err) throw err;
      console.log("Created inventory table.");
    }
  );
  conn.query(
    "INSERT INTO inventory (name, quantity) VALUES (?, ?);",
    ["banana", 150],
    function (err, results, fields) {
      if (err) throw err;
      else console.log("Inserted " + results.affectedRows + " row(s).");
    }
  );
  conn.query(
    "INSERT INTO inventory (name, quantity) VALUES (?, ?);",
    ["orange", 154],
    function (err, results, fields) {
      if (err) throw err;
      console.log("Inserted " + results.affectedRows + " row(s).");
    }
  );
  conn.query(
    "INSERT INTO inventory (name, quantity) VALUES (?, ?);",
    ["apple", 100],
    function (err, results, fields) {
      if (err) throw err;
      console.log("Inserted " + results.affectedRows + " row(s).");
    }
  );
  conn.end(function (err) {
    if (err) throw err;
    else console.log("Done.");
  });
}
