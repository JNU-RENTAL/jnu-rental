const express = require("express");
const { isLoggedIn } = require("../middlewares");
const { User, Comment, Place, Recruitment } = require("../models");
const { Op } = require("sequelize");

const router = express.Router();
router.get("/write", isLoggedIn, async (req, res) => {
  const places = await Place.findAll({});
  res.render("recruit_write", { title: "모집 글 작성", places: places });
});

router.post("/write", isLoggedIn, async (req, res, next) => {
  const { write_place, write_title, write_context } = req.body;
  const place = await Place.findAll({
    where: {
      name: write_place,
    },
  });
  try {
    await Recruitment.create({
      title: write_title,
      text: write_context,
      place: place[0].id,
      user_id: req.user.id,
    });
    return res.redirect("/recruit");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get("/:place", isLoggedIn, async (req, res) => {
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
        { model: User, required: true },
      ],
    });
    const searchPosts = await Recruitment.findAll({
      include: [
        {
          model: Place,
          required: true,
          where: {
            name: req.params.place,
          },
        },
        { model: User, required: true },
      ],
      where: {
        title: { [Op.substring]: req.query.q },
      },
    });

    res.render("recruit", {
      title: `${req.params.place} 모집`,
      places: places,
      posts: req.query.q ? searchPosts : posts,
    });
  } catch (err) {
    console.error(err);
  }
});

router.post("/comment/:post_id", async (req, res, next) => {
  const { comment_text } = req.body;
  try {
    await Comment.create({
      comment_text,
      recruitment_id: req.params.post_id,
      user_id: req.user.id,
    });
    return res.redirect(`/recruit/post/${req.params.post_id}`);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get("/post/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // id에 해당하는 게시물 조회
    const recruit = await Recruitment.findByPk(id);
    const comments = await Comment.findAll({
      include: [{ model: User, required: true }],
      where: {
        recruitment_id: recruit.id,
      },
    });
    const user = await User.findByPk(recruit.user_id);
    const places = await Place.findAll({});

    if (!recruit) {
      // 해당 게시물이 존재하지 않는 경우 404 에러 응답
      res.status(404).send("페이지를 찾을 수 없습니다");
      return;
    }
    // recruit.pug 파일 렌더링
    res.render("recruit_post", {
      title: recruit.title,
      user: user.username,
      post: recruit,
      comments,
      places,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("서버 에러"); // 에러 발생 시 500 에러 응답
  }
});

router.get("/", isLoggedIn, async (req, res) => {
  try {
    const places = await Place.findAll({});
    const posts = await Recruitment.findAll({
      include: [
        {
          model: Place,
          required: true,
        },
        { model: User, required: true },
      ],
    });
    const searchPosts = await Recruitment.findAll({
      include: [
        {
          model: Place,
          required: true,
        },
        { model: User, required: true },
      ],
      where: {
        title: { [Op.substring]: req.query.q },
      },
    });

    res.render("recruit", {
      title: "모집",
      places,
      posts: req.query.q ? searchPosts : posts,
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
