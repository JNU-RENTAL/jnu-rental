const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const { User, Place } = require("../models");

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

router.get("/reservation", isLoggedIn, async (req, res) => {
  const places = await Place.findAll({});
  res.render("placeSelect", { title: "장소 선택", places: places });
});

router.get("/reservation/:place", isLoggedIn, (req, res) => {
  console.log(req.params.place);
  res.render("dateSelect", { title: "날짜 선택", place: req.params.place });
});

router.get("/reservation/:place/:date", isLoggedIn, (req, res) => {
  res.render("timeSelect", {
    title: "시간 선택",
    place: req.params.place,
    date: req.params.date,
  });
});

router.get("/apply/:place/:date/:time", isLoggedIn, (req, res) => {
  res.render("reservation", {
    title: "예약자 정보",
    place: req.params.place,
    date: req.params.date,
    time: req.params.time,
  });
});

router.get("/recruitment", isLoggedIn, (req, res) => {
  res.render("recruitment", { title: "모집" });
});

router.get("/", (req, res, next) => {
  res.render("main", { title: "Main", user: req.user });
});

module.exports = router;
