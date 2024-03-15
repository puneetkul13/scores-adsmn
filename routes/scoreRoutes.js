const express = require("express")
const {getOtp, registerUser} =  require("../controllers/registerController");
const {saveScore, overallDashboard, getWeeklyScore} = require("../controllers/saveScore")
const router = express.Router();
router.route("/getOtp").post(getOtp)
router.route("/register").post(registerUser)
router.route("/saveScore").post(saveScore)
router.route("/overallDashboard").get(overallDashboard)
router.route("/getWeeklyScore").get(getWeeklyScore)
module.exports = router