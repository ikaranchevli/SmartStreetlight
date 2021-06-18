const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const userRole = db.userRoles;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  var reqRoles = [];

  reqRoles.push(req.body.role);

  User.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    active: true,
    changePassFlag: true,
    failedLoginAttempts: 0,
  })
    .then((user) => {
      if (reqRoles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: reqRoles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        var failedAttempts = user.failedLoginAttempts;
        failedAttempts = parseInt(failedAttempts) + 1;
        user.failedLoginAttempts = failedAttempts;
        user.save();

        if (user.failedLoginAttempts >= 3) {
          user.active = false;
          user.save();
          return res.status(401).send({
            accessToken: null,
            message:
              "Sorry, your account has been disabled due to multiple failed login attempts!",
          });
        } else {
          return res.status(401).send({
            accessToken: null,
            message:
              "Invalid Password. You have " +
              (3 - user.failedLoginAttempts) +
              " more attempts until your account is disabled!",
          });
        }
      }

      if (!user.active) {
        return res.status(401).send({
          accessToken: null,
          message: "Account is Disabled. Please contact admin!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      user.failedLoginAttempts = 0;
      user.lastLogin = Date.now();
      user.save();

      var authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          roles: authorities,
          changePass: user.changePassFlag,
          accessToken: token,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getusers = (req, res) => {
  User.findAll({ include: userRole })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "No User found." });
      }

      var authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          roles: authorities,
        });
      });

      // res.status(200).send({
      //   firstname: user.firstname,
      //   lastname: user.lastname,
      //   email: user.email,
      // });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
