const express = require("express");
const Recruitment = require("../models/recruitment");
const User = require("../models/user");

const router = express.Router();
let test = '';

router.get("/", (req, res, next) => {
  res.render("recruit", { title: "Recruit", user: res.user });
  console.log(test);
});

router.get("/", async (req, res) => {
    try {
      const recruits = await Recruitment.findAll();
      res.json(recruits);
    } catch (error) {
      console.error(error);
      res.status(500).send("서버 에러"); // 에러 발생 시 500 에러 응답
    }
  });

router.get(`/post`, (req, res, next) => {
  res.render("recruit_post", { title: "Recruit_post", user: res.user });
  console.log(test);
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

module.exports = router;
