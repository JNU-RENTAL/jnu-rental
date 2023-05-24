const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const { User } = require("../models");

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

router.get("/", (req, res, next) => {
  res.render("main", { title: "Main", user: req.user });
});

router.get("/select", (req, res) => {
  res.render("select", { title: "Select"});
});

router.get("/sendEmail", (req, res) => {
  res.render("sendEmail", { title: "sendEmail"});
})

router.get("/profile", (req, res) => {
  res.render("profile", { title: "profile"});
})

module.exports = router;
