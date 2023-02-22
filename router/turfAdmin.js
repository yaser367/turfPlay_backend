const express = require("express");
const router = express();

const TurfAdminAuthControll = require("../controllers/TurfAdmin-controller/authentication");
const TurfAdminControll = require("../controllers/TurfAdmin-controller/TurfAdminControll");
const Auth = require("../middleware/auth");
const mailControll = require("../controllers/user-controller/mail-controller");
const turfController = require("../controllers/TurfAdmin-controller/turfController");
const verifyJWT = require("../middleware/Jwt")

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
router.get("/getAllturf", verifyJWT,turfController.getAllturf);
router.get("/getoneTurf/:id", verifyJWT,turfController.oneTurf);
router.get("/getTurfAdmin/:id",verifyJWT, TurfAdminControll.getTufAdmin);
router.get("/get/:id",verifyJWT,turfController.getTurf)
router.get("/getSlot/:date",verifyJWT,turfController.getslot)
router.get("/getOrder/:id",verifyJWT,turfController.getOrders)

/** Put routes */
router.put("/updateTurf", turfController.uploadImage);
router.put("/addLocation", turfController.addLocation);
router.put("/deleteTurf/:id", turfController.listOrUnlistTurf);
router.put("/updateProfile", TurfAdminControll.updateProfile);
router.put("/editTurf", turfController.editTurf);
router.put("/deleteImg", turfController.deleteTurfImg);
router.put("/addTimeslot", turfController.addSlot);
router.put('/bookSlot',turfController.bookSlot)

module.exports = router;
