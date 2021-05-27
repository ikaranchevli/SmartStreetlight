const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get(
    "/api/test/technician",
    [authJwt.verifyToken],
    controller.technicianAccess
  );

  app.get(
    "/api/test/council",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.councilAccess
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminAccess
  );

  app.get(
    "/api/test/users",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getUsers
  );

  app.get(
    "/api/test/DeleteUser",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteUser
  );

  app.get(
    "/api/test/FindUser",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.findUser
  );

  app.get(
    "/api/test/EditUser",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.editUser
  );

  app.post(
    "/api/test/SetPass",
    [authJwt.verifyToken],
    controller.updatePassword
  );

  app.get(
    "/api/test/ChangeStatus",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.changeStatus
  );

  app.get(
    "/api/test/checkChangePassFlag",
    [authJwt.verifyToken],
    controller.getChangePassFlag
  );

  app.get(
    "/api/test/streetlights",
    [authJwt.verifyToken],
    controller.getStreetlightData
  );
};
