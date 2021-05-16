const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
var bcrypt = require("bcryptjs");

const app = express();

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");
const Role = db.role;
const User = db.user;
const userRoles = db.userRoles;

db.sequelize.sync();
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and Resync Db");
//   initial();
// });

app.get("/admin/portal", (req, res) => {
  fs.readFile("./data/StreetLights.json", "utf-8", (err, jsonString) => {
    // console.log(jsonString);
    res.json(JSON.parse(jsonString));
  });
  // res.json({ message: "Welcome to application." });
});

// routes
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server running on port => " + PORT);
});

function initial() {
  Role.create({
    id: 1,
    name: "technician",
  });

  Role.create({
    id: 2,
    name: "council",
  });

  Role.create({
    id: 3,
    name: "admin",
  });

  User.create({
    id: 1,
    firstname: "admin",
    lastname: "admin",
    email: "admin@admin.com",
    password: bcrypt.hashSync("admin", 8),
    roles: ["admin"],
  });
}
