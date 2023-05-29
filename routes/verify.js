const express = require('express');
const router = express.Router();
const User = require("../models/user");

// POST 요청 처리
router.post('/', async (req, res, next) => {
    const { verification } = req.body; // 폼 데이터에서 인증번호 추출
  
    try {
      const storedVerification = req.session.verification; // 세션에 저장된 인증번호 가져오기
  
      // 인증번호가 일치하지 않는 경우
      if (verification !== storedVerification) {
        return res.redirect('/join?error=verification');
      } else {
        // 인증 완료 처리
        req.session.verification = null; // 세션에서 인증번호 초기화
  
        if (storedVerification) {
            // 인증 상태 업데이트
            const user = await User.findOne({ where: { verification_code: storedVerification } });
            if (user) {
              user.verification_code = null; // 인증번호 초기화
              await user.save();
            }
        }
  
        return res.redirect('/'); // 인증 성공 시 메인 페이지로 이동
      }
    } catch (error) {
      console.error(error);
      return next(error);
    }
  });
  
  

module.exports = router;
