const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
const User = require("../models/user");
const crypto = require('crypto');
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

// const mailOptions = (mail) =>{
//   return {
//   from: "gjwogur0325@naver.com",
//   to: mail,
//   subject: "가입 인증 메일",
//   html: `
//       가입확인 버튼를 누르시면 가입 인증이 완료됩니다.<br/>
//       <form action="#" method="POST">
//         <button>가입확인</button>
//       </form>  
//       `,
// };} 

// 랜덤 인증번호 생성 함수
function generateVerificationCode() {
  const codeLength = 6; // 인증번호 길이
  const chars = '0123456789'; // 인증번호에 사용할 문자셋
  let code = '';
  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  return code;
}

router.post("/join", async (req, res, next) => {
  const { username, password, jnu_mail } = req.body;
  try {
    const exUser = await User.findOne({ where: { username } });
    if (exUser) {
      return res.redirect("/join?error=exist");
    }
    const hash = await bcrypt.hash(password, 12);
    const verificationCode = generateVerificationCode(); // 랜덤 인증번호 생성
    await User.create({
      username,
      password: hash,
      jnu_mail: `${jnu_mail}@jejunu.ac.kr`,
      verification_code: verificationCode, // 생성된 인증번호 저장
    });

    const mail = `${jnu_mail}@jejunu.ac.kr`;
    const mailOptions = {
      from: "gjwogur0325@naver.com",
      to: mail,
      subject: "가입 인증 메일",
      text: `인증번호: ${verificationCode}`,
    };
    transporter.sendMail(mailOptions); // 인증 메일 발송

    return res.redirect("/auth/verify");

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
    return req.login(user, async (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }

      // 로그인 성공 후, 이메일 인증 여부 확인 및 업데이트
      if (user.is_certified === true) {
        // 이미 인증된 사용자인 경우
        return res.redirect("/select");
      } else {
        try {
          await User.update(
            { is_certified: true },
            { where: { id: user.id } }
          );
          return res.redirect("/select");
        } catch (error) {
          console.error(error);
          return next(error);
        }
      }
    });
  })(req, res, next);
});



router.get("/verify", (req, res) => {
  res.render("verify", {title : "인증화면"}); // verify.pug 또는 해당 페이지 템플릿을 렌더링하는 로직을 추가해야 합니다.
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});



module.exports = router;
