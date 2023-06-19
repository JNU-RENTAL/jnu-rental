const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const { User, Recruitment, Place } = require("../models");
const Reservation = require("../models/reservation");

const router = express.Router();

router.get("/profile/:user_id", async (req, res) => {
  const reservation = await Reservation.findAll({
    include: [
      {
        model: Place,
        required: true,
      },
    ],
    where: { user_id: req.params.user_id },
  });

  const users = await User.findOne({
    where: {
      id: req.params.user_id,
    },
  });

  try {
    res.render("profile", {
      title: `내 정보`,
      user_id: req.params.user_id,
      user: users,
      reservations: reservation,
    });
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
    res.render("recruit_post", {
      title: "Recruit_post",
      user: res.user,
      post: recruit,
    });
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

router.get("/reservation", isLoggedIn, async (req, res) => {
  const places = await Place.findAll({});
  res.render("placeSelect", {
    title: "장소 선택",
    places: places,
    user: req.user,
  });
});

router.get("/reservation/:place", isLoggedIn, (req, res) => {
  console.log(req.params.place);
  res.render("dateSelect", {
    title: "날짜 선택",
    place: req.params.place,
    user: req.user,
  });
});

router.get("/reservation/:place/:date", isLoggedIn, (req, res) => {
  res.render("timeSelect", {
    title: "시간 선택",
    place: req.params.place,
    date: req.params.date,
    user: req.user,
  });
});

router.get(
  "/apply/:user_id/:place/:date/:time/",
  isLoggedIn,
  async (req, res) => {
    const user = await User.findOne({
      where: {
        id: req.params.user_id,
      },
    });

    res.render("reservation", {
      title: "예약자 정보",
      place: req.params.place,
      date: req.params.date,
      time: req.params.time,
      user_id: user.id,
    });
  }
);

router.post("/delete/reservation/:id", isLoggedIn, async (req, res, next) => {
  try {
    const reservation = await Reservation.findAll({
      where: {
        id: req.params.id,
      },
    });

    if (req.user.id === reservation[0].user_id) {
      await Reservation.destroy({ where: { id: req.params.id } });
    }

    return res.redirect(`/profile/${req.user.id}`);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get("/select", (req, res) => {
  res.render("select", { title: "Select", user: req.user });
});

router.get("/sendEmail", (req, res) => {
  res.render("sendEmail", { title: "sendEmail" });
});

router.get("/", (req, res, next) => {
  res.render("main", { title: "Main", user: req.user });
});

module.exports = router;
