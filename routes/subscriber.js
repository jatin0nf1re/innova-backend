const express = require("express");


const Subscriber = require("../models/subscriber");
const subscriberController = require('../controllers/subscriber');

// const cloudinary = require("../utils/cloudinary");
// const upload = require("../utils/multer");

const router = express.Router();




router.get("", subscriberController.getSubscribers);

router.post("" , subscriberController.addSubscriber);
// router.post("" , upload.single("image"), lectureController.addLectures);



// router.delete("/:id", lectureController.deleteLecture);

// router.get("/:id", lectureController.findLecture);


// router.put( "/:id", multer({ storage: storage }).single("imagePath") ,lectureController.updateLecture);


module.exports = router;
