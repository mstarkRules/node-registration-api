const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.json");

//generates a jwt token to return to the user
function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 3600 * 24,
  });
}

//creates register route and save the data on db
router.post("/register", async (req, res) => {
  const { email } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).send({ error: "User already exists" });
    }

    const user = await User.create(req.body);

    //clears the passwords before return response
    user.password = undefined;

    //return user info and token in case of success
    return res.send({
      user,
      token: generateToken({ id: user.id }),
    });
  } catch (error) {
    return res.status(400).send({ error: "Registration failed" });
  }
});

//creates route to authenticate user
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

  //returns user info and token in case of success
  res.send({
    user,
    token: generateToken({ id: user.id }),
  });
});

module.exports = (app) => app.use("/auth", router);
