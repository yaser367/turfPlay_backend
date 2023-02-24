const express = require("express");
const router = express();

const userControll = require("../controllers/user-controller/auth-controller");
const userAuth = require('../middleware/auth')
const mailControll = require('../controllers/user-controller/mail-controller')
const userTurfController = require('../controllers/user-controller/turfController')
const checkoutControll = require('../controllers/user-controller/checkoutController')


/** Post methods */
router.post("/register", userControll.userRegistration);
router.post("/registerMail",mailControll.registerMail)
router.post("/authenticate",userControll.verifyUser,(req,res)=>res.end());
router.post("/login",userControll.verifyUser,userControll.userLogin);
router.post('/verifyuser',userControll.userOtpverify)
router.post('/checkout',checkoutControll.checkout)
router.post('/paymentVerification/:id/:turfId',checkoutControll.paymentVerification)

/** Get methods */
router.get("/user/:username",userControll.getUser);
router.get("/generateOtp",userAuth.localVariables,userControll.generateOtp);
router.get("/verifyOtp",userControll.verifyOtp);
router.get("/createResetSession",userControll.createResetSession);
router.get("/getAllTurfs",userAuth.isAuths,userTurfController.getAllTurfs)
router.get("/getOneTurf/:id",userAuth.isAuths,userTurfController.getoneTurf)
router.get("/filterd/:game",userAuth.isAuths,userTurfController.filterData)
router.get("/getOrders",userAuth.isAuths,checkoutControll.getOrders)

/** Put methods */
router.put("/updateUser",userAuth.isAuth,userControll.updateUser);
router.put("/resetPassword",userControll.verifyUser,userControll.resetPassword);


module.exports = router;
