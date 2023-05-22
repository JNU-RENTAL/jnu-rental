const express = require("express");
const Reservation = require("../models/reservation");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");

const router = express.Router();

let date = new Date();

router.post("/reservation", async (req, res, next) => {
  const { time, name, student_id, phone_number } = req.body;
  try {
    await Reservation.create({
      begin_time: new Date(
        `${time.slice(0, 4)}-${time.slice(6, 8)}-${time.slice(10, 12)} ${
          time.slice(14, 19) + ":00"
        }`
      ),
      end_time: new Date(
        `${time.slice(0, 4)}-${time.slice(6, 8)}-${time.slice(10, 12)} ${
          time.slice(-5) + ":00"
        }`
      ),
      reservation_name: name,
      reservation_student_id: student_id,
      reservation_phone_number: phone_number,
    });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
