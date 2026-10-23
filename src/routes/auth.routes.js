const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User } = require("../../models/index");
const router = express.Router();

// register user account
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, gender, password } = req.body;

  // hashing password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("hashedPassword", hashedPassword);

  const savedUser = await User.create({
    firstName,
    lastName,
    email,
    gender,
    password: hashedPassword,
  });

  return res.json({
    message: "User registered successfully",
    data: savedUser,
  });
});

// login
router.post("/login", async (req, res) => {
  // read body
  const { email, password } = req.body;

  // find user by email
  const user = await User.findOne({ where: { email } });

  // set validation
  if (!user) {
    return res.json({
      message: `User email=${email} not found`,
    });
  }

  // comparing password
  const isMatch = await bcrypt.compare(password, user.password);

  // validation
  if (!isMatch) {
    return res.json({
      message: `User password=${password} incorrect`,
    });
  }

  // generate token
  const token = jwt.sign({ id: user.id, email: user.email }, "salait-system");
  return res.json({
    message: "User login successfully",
    data: {
      user,
      token,
    },
  });
});

module.exports = router;
