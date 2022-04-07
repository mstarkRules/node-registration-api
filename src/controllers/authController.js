const express = require("express");

const User = require("../models/User");

const router = express.Router();

//create post route and save the data on db
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

module.exports = (app) => app.use("/auth", router);
