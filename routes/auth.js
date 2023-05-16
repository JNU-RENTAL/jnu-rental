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
      verificationCode, // 생성된 인증번호 저장
    });

    const mail = `${jnu_mail}@jejunu.ac.kr`;
    const mailOptions = {
      from: "gjwogur0325@naver.com",
      to: mail,
      subject: "가입 인증 메일",
      text: `인증번호: ${verificationCode}`,
    };
    transporter.sendMail(mailOptions); // 인증 메일 발송

    return res.redirect("/join");

  } catch (error) {
    console.error(error);
    return next(error);
  }
});


router.post('/verify', async (req, res, next) => {
  const { verification } = req.body;
  const user = req.user; // 로그인한 사용자 정보

  try {
    // 입력한 인증번호와 저장된 인증번호 비교
    if (verification !== user.verificationCode) {
      return res.redirect('/join?error=verification'); // 인증번호가 일치하지 않는 경우
    }

    // 인증 완료 처리
    user.verificationCode = null; // 인증번호 초기화
    await user.save();

    return res.redirect('/join?success=verification'); // 인증 성공
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
