const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.js");

router.get("/", (req, res) => {
  res.send(
    "does this route works??????????????????????????????????????????????????????????????????"
  );
});

// SIGN UP VIEW
router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});

// POST A NEW USER TO THE DATABASE WHEN THE FORM IS SUBMITTED
router.post("/sign-up", async (req, res) => {
  // get data from the form (req.body)
  // check if someone already exists
  console.log(req.body);
  const userInDatabase = await User.findOne({ username: req.body.username });
  if (userInDatabase) {
    return res.send("username already taken");
  }
  // check that password and confirmPassword are the same
  if (req.body.password !== req.body.confirmPassword) {
    return res.send("password and confirm password must match");
  }

  // check for password complexity (LEVEL UP)
  // hash the password
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hashedPassword;
  const newUser = await User.create(req.body);
  req.session.user = {
    username: newUser.username,
    _id: newUser._id,
  };
  req.session.save(() => {
    res.redirect("/");
  });
});

//SIGN VIEW
router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs");
});

// POST TO SIGN THE USER IN (CREATE THE SESSION)
router.post("/sign-in", async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username });
  // if user in database is null (user do not exists) then send this message
  if (!userInDatabase) {
    return res.send("Login failed. please try again.");
  }
  const validPassword = bcrypt.compareSync(
    req.body.password,
    userInDatabase.password
  );
  if (!validPassword) {
    return res.send("login failed, please try again.");
  }
  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id,
  };
  req.session.save(()=>{
  res.redirect('/')

  })
});

router.post("/", async (req, res) => {
  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id,
  };
  req.session.save(() => {
    res.redirect("/");
  });
});

// SIGN OUT VIEW
router.get("/sign-out", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});
module.exports = router;
