const express = require("express");
const router = express();

const adminController = require("../controllers/admin-controller/adminController");
const adminAuth = require("../controllers/admin-controller/adminAuth");
const auth = require("../middleware/auth");

/**Get routes */
router.get("/users", adminController.getUserData);
router.get("/turfAdmin", adminController.getTurfAdminData);
router.get("/getTurfRequest", adminController.getTurfRequest);
router.get("/getAllOrder",adminController.getAllOrder)
router.get("/totalSale",adminController.totalSale)

/** Put routes */
router.put(
  "/blockUser/:id",
  adminController.blockUser
);
router.put("/blockTurfAdmin/:id", adminController.blockTurfAdmin);
router.put("/acceptReq", adminController.acceptRequest);
router.put("/rejectReq", adminController.rejectRequest);
/** Post routes */
router.post("/login", adminAuth.login);

/** Delete routes */
router.delete("/rejectReq", adminController.rejectRequest);

module.exports = router;
