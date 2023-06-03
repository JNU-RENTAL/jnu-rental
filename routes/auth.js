const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");

const router = express.Router();

router.post("/join", async (req, res, next) => {
  const { username, password, jnu_mail } = req.body;
  try {
    const exUser = await User.findOne({ where: { username } });
    if (exUser) {
      return res.redirect("/join?error=exist");
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      username,
      password: hash,
      jnu_mail: `${jnu_mail}@jejunu.ac.kr`,
    });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?error=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/");
      // return user.is_certified
      //     ? res.redirect("/")
      //     : res.redirect("/verify");
    });
  })(req, res, next);
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

module.exports = router;
