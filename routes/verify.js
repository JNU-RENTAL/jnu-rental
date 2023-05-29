const express = require('express');
const session = require('express-session');
const router = express.Router();
const User = require('../models/user');

// 세션 미들웨어 설정
router.use(
  session({
    secret: 'process.env.COOKIE_SECRET',
    resave: false,
    saveUninitialized: true,
  })
);

// POST 요청 처리
router.post('/', async (req, res, next) => {
  const { verification } = req.body; // 폼 데이터에서 인증번호 추출

  try {
    const storedVerification = req.session.verification; // 세션에서 저장된 인증번호 가져오기

    // 입력한 인증번호와 세션에 저장된 인증번호 비교
    if (verification === storedVerification) {
      // 인증번호가 일치하는 경우
      await User.update(
        { is_certified: 1 },
        { where: { verification_code: verification || null } }
      );

      // 인증 완료 처리
      req.session.verification = null; // 세션에서 인증번호 초기화

      return res.redirect('/'); // 인증 성공 시 메인 페이지로 이동
    } else {
      // 인증번호가 일치하지 않는 경우
      return res.redirect('/join?error=verification');
    }
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
