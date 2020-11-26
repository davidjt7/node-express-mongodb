module.exports = (app) => {
  const users = require("../controllers/user.controller.js");
  const jwt = require("jsonwebtoken");
  const secret = process.env.SECRET;

  var router = require("express").Router();

  const auth = (req, res, next) => {
    jwt.verify(req.headers["auth"], secret, (err, decoded) => {
      if (!err) {
        req.user = decoded;
        next();
      } else {
        res.json(err);
        return;
      }
    });
  };

  // Register a new User
  router.post("/", users.create);

  // Login
  router.post("/login", users.login);

  // Retrieve User Details
  router.get("/", auth, users.getUserDetails);

  // Retrieve User Logs
  router.get("/logs", auth, users.getUserLogs);

  app.use("/api/users", router);
};
