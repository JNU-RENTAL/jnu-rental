const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
const User = require("../models/user");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");

dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "naver",
  host: "smtp.naver.com",
  port: 465,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

const mailOptions = (mail) =>{
  return {
  from: "gjwogur0325@naver.com",
  to: mail,
  subject: "가입 인증 메일",
  html: `
      가입확인 버튼를 누르시면 가입 인증이 완료됩니다.<br/>
      <form action="#" method="POST">
        <button>가입확인</button>
      </form>  
      `,
};} 


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
      jnu_mail: `${jnu_mail}@jejunuac.kr`,
    });

    transporter.sendMail(mailOptions(`${jnu_mail}@jejunuac.kr`));

    return res.redirect("/join");
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
      return res.redirect("/select");
    });
  })(req, res, next);
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});



module.exports = router;
