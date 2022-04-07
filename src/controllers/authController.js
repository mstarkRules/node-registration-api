const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();
const jwt = require("jsonwebtoken");

//creates post route and save the data on db
router.post("/register", async (req, res) => {
  const { email } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).send({ error: "User already exists" });
    }

    const user = await User.create(req.body);

    //clears the passwords before return response
    user.password = undefined;

    return res.send({ user });
  } catch (error) {
    return res.status(400).send({ error: "Registration failed" });
  }
});

//creates router to authenticate user before save some data
router.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  //checks if user not exists
  if (!user) {
    return res.status(400).send({ error: "User not found" });
  }

  //checks if password is not the same saved on db. It uses bcrypt to compare the encripted pass
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).send({ error: "Invalid password" });
  }

  //hides passwords in the route response
  user.password = undefined;

  //returns user info in case success
  res.send({ user });
});

module.exports = (app) => app.use("/auth", router);
