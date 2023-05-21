const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const multerMiddleware = require("../middlewares/multer");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  app.get("/user/get", [authJwt.verifyToken], controller.getAllUser);

  app.put(
    "/user/update/:id",
    [multerMiddleware.single("file")],
    [authJwt.verifyToken],
    controller.updateUser
  );

  app.put(
    "/user/:userId/password",
    [authJwt.verifyToken],
    controller.updatePassword
  );
};
