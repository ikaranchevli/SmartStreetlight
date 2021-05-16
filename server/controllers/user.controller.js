const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const userRole = db.userRoles;

var bcrypt = require("bcryptjs");
const users = User.findAll();

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.technicianAccess = (req, res) => {
  res.status(200).send("Technician Content.");
};

exports.adminAccess = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.councilAccess = (req, res) => {
  res.status(200).send("Council Content.");
};

exports.getUsers = (req, res) => {
  User.findAll({ include: db.userRoles })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      res.status(200).send({ user });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.deleteUser = (req, res) => {
  if (
    User.destroy({
      where: {
        email: req.query.email,
      },
    })
  ) {
    res.status(200).send("User Deleted");
  }
};

exports.findUser = (req, res) => {
  User.findAll({
    include: db.userRoles,
    where: {
      email: req.query.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      res.status(200).send({ user });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.editUser = (req, res) => {
  User.findOne({
    where: {
      email: req.query.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      user.firstname = req.query.fname;
      user.lastname = req.query.lname;

      if (user.save()) {
        res.status(200).send("User updated");
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.updatePassword = (req, res) => {
  User.findOne({
    where: {
      email: req.query.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      user.password = bcrypt.hashSync(req.query.password, 8);

      if (user.save()) {
        res.status(200).send("Password updated");
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
