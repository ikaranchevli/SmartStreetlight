const { verifyCreateUser } = require("../middleware");
const controller = require("../controllers/auth.controller");
const { authJwt } = require("../middleware");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/createuser",
    [
      verifyCreateUser.checkDuplicateUsernameOrEmail,
      verifyCreateUser.checkRolesExisted,
      authJwt.isAdmin,
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/getusers", controller.getusers);
};
