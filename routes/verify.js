const express = require('express');
const router = express.Router();
const User = require('../models/user');

// POST 요청 처리
router.post('/', async (req, res, next) => {
  const { verification } = req.body;
  console.log(req.body);
  try {
    const storedUser = await User.findOne({ where: { verification_code: verification } });

    if (!storedUser) {
      // 인증번호가 일치하지 않는 경우
      return res.json({ success: false });
    } else {
      // 인증번호가 일치하는 경우
      storedUser.verification_code = null; // 인증번호 초기화
      await storedUser.save();

      return res.json({ success: true });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false });
  }
});

module.exports = router;
