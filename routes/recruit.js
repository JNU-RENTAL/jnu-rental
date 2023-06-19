const express = require("express");
const { isLoggedIn } = require("../middlewares");
const { User, Comment, Place, Recruitment } = require("../models");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

const router = express.Router();
router.get("/write", isLoggedIn, async (req, res) => {
  const places = await Place.findAll({});
  res.render("recruit_write", {
    title: "모집 글 작성",
    places,
    user: req.user,
  });
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

router.post("/delete/post/:id", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Recruitment.findAll({
      where: {
        id: req.params.id,
      },
    });

    if (req.user.id === post[0].user_id) {
      await Recruitment.destroy({ where: { id: req.params.id } });
    }

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
      order: sequelize.col("createdAt"),
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
      order: sequelize.col("createdAt"),
    });

    const comments = await Comment.findAll({
      attributes: [
        "recruitment_id",
        [sequelize.fn("COUNT", sequelize.col("recruitment_id")), "count"],
      ],
      group: ["recruitment_id"],
    });

    const commentsArray = comments.map((comment) => ({
      postId: comment.recruitment_id,
      count: comment.get("count"),
    }));

    res.render("recruit", {
      title: `${req.params.place} 모집`,
      places,
      posts: req.query.q ? searchPosts : posts,
      user: req.user,
      comments: commentsArray,
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

router.post(
  "/delete/:post_id/:comment_id",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const comment = await Comment.findAll({
        where: {
          id: req.params.comment_id,
        },
      });

      if (req.user.id === comment[0].user_id) {
        await Comment.destroy({ where: { id: req.params.comment_id } });
      }
      return res.redirect(`/recruit/post/${req.params.post_id}`);
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);

router.get("/edit/post/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // id에 해당하는 게시물 조회
    const recruit = await Recruitment.findByPk(id);
    const places = await Place.findAll({});
    const nowPlace = await Place.findByPk(recruit.place);

    // recruit.pug 파일 렌더링
    res.render("recruit_write", {
      title: "모집 글 수정",
      post: recruit,
      places,
      nowPlace,
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("서버 에러"); // 에러 발생 시 500 에러 응답
  }
});

router.post("/edit/:post_id", async (req, res, next) => {
  const { write_place, write_title, write_context } = req.body;
  const place = await Place.findAll({
    where: {
      name: write_place,
    },
  });
  try {
    await Recruitment.update(
      {
        title: write_title,
        text: write_context,
        place: place[0].id,
      },
      { where: { id: req.params.post_id } }
    );
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
      postUser: user.username,
      post: recruit,
      user: req.user,
      comments,
      places,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("서버 에러"); // 에러 발생 시 500 에러 응답
  }
});

router.get("/", async (req, res) => {
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
      order: sequelize.col("createdAt"),
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
      order: sequelize.col("createdAt"),
    });

    const comments = await Comment.findAll({
      attributes: [
        "recruitment_id",
        [sequelize.fn("COUNT", sequelize.col("recruitment_id")), "count"],
      ],
      group: ["recruitment_id"],
    });

    const commentsArray = comments.map((comment) => ({
      postId: comment.recruitment_id,
      count: comment.get("count"),
    }));

    res.render("recruit", {
      title: "모집",
      places,
      posts: req.query.q ? searchPosts : posts,
      user: req.user,
      comments: commentsArray,
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
