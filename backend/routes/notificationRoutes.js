const express =
require("express");


const router =
express.Router();


const proteger =
require("../middleware/authMiddleware");


const {

mesNotifications,

marquerLu

}=require(
"../controllers/notificationController"
);



router.get(
"/",
proteger,
mesNotifications
);



router.put(
"/:id",
proteger,
marquerLu
);



module.exports =
router;