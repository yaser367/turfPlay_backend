const express = require("express");
const router = express();

const TurfAdminAuthControll = require("../controllers/TurfAdmin-controller/authentication");
const TurfAdminControll = require("../controllers/TurfAdmin-controller/TurfAdminControll");
const Auth = require("../middleware/auth");
const mailControll = require("../controllers/user-controller/mail-controller");
const turfController = require("../controllers/TurfAdmin-controller/turfController");

/** Post routes */
router.post("/login", TurfAdminAuthControll.handleLogin);
router.post("/register", TurfAdminControll.register);
router.post("/otpVerify", TurfAdminControll.verifyOTP);
router.post("/resentOtp", TurfAdminControll.resendOtp);
router.post("/forgotPassword", TurfAdminControll.forgotPassword);
router.post("/resetPassword", TurfAdminControll.resetPassword);
router.post("/addTurf", turfController.addTurf);
router.post("/imgUpload", turfController.uploadImage);
router.post("/docUpload", turfController.uploadDoc);
router.post("/addTimeSlot", turfController.addSlot);

/** Get routes */
router.get("/getAllturf", turfController.getAllturf);
router.get("/getoneTurf/:id", turfController.oneTurf);
router.get("/getTurfAdmin/:id", TurfAdminControll.getTufAdmin);
router.get("/get/:id",turfController.getTurf)

/** Put routes */
router.put("/updateTurf", turfController.uploadImage);
router.put("/addLocation", turfController.addLocation);
router.put("/deleteTurf/:id", turfController.listOrUnlistTurf);
router.put("/updateProfile", TurfAdminControll.updateProfile);
router.put("/editTurf", turfController.editTurf);
router.put("/deleteImg", turfController.deleteTurfImg);
router.put("/addTimeslot", turfController.addSlot);

module.exports = router;
