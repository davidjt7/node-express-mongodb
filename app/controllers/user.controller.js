const db = require("../models");
const User = db.users;
const UserLog = db.userLogs;
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

exports.create = async (req, res) => {
  try {
    if (!req.body.name) {
      res.status(400).send({ message: "Name required!" });
      return;
    }
    if (!req.body.email) {
      res.status(400).send({ message: "Email required!" });
      return;
    }
    if (!req.body.password) {
      res.status(400).send({ message: "Password required!" });
      return;
    }

    const userExists = await User.findOne({
      email: req.body.email,
    });
    if (userExists) {
      res.status(400).send({ message: "Email in use." });
      return;
    } else {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      const result = await user.save(user);
      res.send(result);
      return;
    }
  } catch (error) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the User.",
    });
  }
};

exports.login = async (req, res) => {
  try {
    if (!req.body.email) {
      res.status(400).send({ message: "Email required!" });
      return;
    }
    if (!req.body.password) {
      res.status(400).send({ message: "Password required!" });
      return;
    }

    User.findOne(req.body).then((data) => {
      if (!data) {
        res.status(400).send({ message: "Invalid user." });
        return;
      }
      const token = jwt.sign({ name: data.name, email: data.email }, secret, {
        expiresIn: 120,
      });
      const userLog = new UserLog({
        userId: data._id,
        authToken: token,
      });

      userLog.save(userLog);
      res.send({ message: "Login successful!", token });
      return;
    });
  } catch (error) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving users.",
    });
    return;
  }
};

exports.getUserDetails = async (req, res) => {
  res.send({ message: "User details retrieved successfully!", details: req.user });
};

exports.getUserLogs = async (req, res) => {
  try {
    const userLogExists = await UserLog.findOne({
      authToken: req.headers["auth"],
    });
    if (!userLogExists) {
      res.status(400).send({ message: "No logs." });
      return;
    }
    const user = await User.findOne({ _id: userLogExists.userId });
    const userLogs = await UserLog.find({ userId: userLogExists.userId });

    res.send({ message: "Logs retrieved successfully!", user, userLogs });
    return;
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving users.",
    });
    return;
  }
};
