const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const { User, Place, Recruitment } = require("../models");
const { cat } = require("require/example/shared/dependency");

const router = express.Router();

router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile", { title: "내 정보" });
});

router.get("/join", isNotLoggedIn, (req, res) => {
  res.render("join", { title: "회원가입" });
});

router.get("/login", isNotLoggedIn, (req, res) => {
  res.render("login", { title: "로그인" });
});

router.get("/recruit", isLoggedIn, async (req, res) => {
  try {
    const places = await Place.findAll({});
    const posts = await Recruitment.findAll({
      include: [
        {
          model: Place,
          required: true,
        },
      ],
    });
    res.render("recruit", {
      title: "모집",
      places: places,
      posts: posts,
    });
  } catch (err) {
    console.error(err);
  }
});

router.get("/recruit/:place", isLoggedIn, async (req, res) => {
  try {
    const places = await Place.findAll({});
    const posts = await Recruitment.findAll({
      include: [
        {
          model: Place,
          required: true,
          where: {
            name: req.params.place,
          },
        },
      ],
    });
    res.render("recruit", {
      title: `${req.params.place} 모집`,
      places: places,
      posts: posts,
    });
  } catch (err) {
    console.error(err);
  }
});

router.get("/", (req, res, next) => {
  res.render("main", { title: "Main", user: req.user });
});

module.exports = router;
