const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const { User, Recruitment, Place} = require("../models");

const router = express.Router();

router.get("/profile", isLoggedIn, async (req, res) => {
  const places = await Place.findAll({});
  const user = req.user;
  const recruit = await Recruitment.findAll({
    include: [
      {
        model: Place,
        required: true,
      },
    ],
    where: {user_id: user.id},
  });

  try {
    res.render("profile", { title: `내 정보`, user, recruits : recruit });
  } catch (error) {
    console.error(error);
    res.status(500).send("서버 에러"); // 에러 발생 시 500 에러 응답
  }
});

router.get("/post/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // id에 해당하는 게시물 조회
    const recruit = await Recruitment.findByPk(id);
    
    if (!recruit) {
      // 해당 게시물이 존재하지 않는 경우 404 에러 응답
      res.status(404).send("페이지를 찾을 수 없습니다");
      return;
    }
    // recruit.pug 파일 렌더링
    res.render("recruit_post", { title: "Recruit_post", user: res.user, post: recruit });
  } catch (error) {
    console.error(error);
    res.status(500).send("서버 에러"); // 에러 발생 시 500 에러 응답
  }
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

module.exports = router;
