const express = require("express");
const multer = require("multer");
const lecture = require("../models/lecture");

const fs= require('fs');
const path = require('path');
// const cloudinary = require("../utils/cloudinary");
// const upload = require("../utils/multer");

const Lecture = require("../models/lecture");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images/lectures");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

exports.getLectures =  (req, res, next) => {
  Lecture.find().then(documents => {
    res.status(200).json({
      message: "Posts fetched successfully!",
     lectures: documents
    });
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });;

};


exports.addLectures = async (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");

 try{
  //  const result = await cloudinary.uploader.upload(req.file.path);

  console.log(req.body);
    const lecture = new Lecture({

      name: req.body.name,
      profession: req.body.profession,
      lectureTitle: req.body.lectureTitle,
      date: {
        "year": req.body.year,
        "month": req.body.month,
        "day": req.body.day,

      },
      regLink: req.body.regLink,
      status: req.body.status,
      imagePath: url + "/images/lectures/" + req.file.filename,
      time: req.body.time
    });
    // imagePath: result.public_id,


      b = lecture
      await lecture.save().then(createdPost => {
        res.status(201).json({
          b
        });
      }
      )}

      catch (err) {
        console.log(err);
      }

};




exports.deleteLecture = (req, res, next) =>{
  Lecture.findByIdAndDelete(req.params.id).exec()
  .then((result) => {
    console.log(result);
    const img = path.join(path.relative('http://localhost:5000',result.imagePath));
    console.log(img);
    fs.unlink(img, err => {
      console.log(err);
    });
      res.status(200).json({ message: "Lecture deleted!" });
  }).catch((err) => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  })
  // const prom = Lecture.findByIdAndDelete(req.params.id);
  // prom.then(doc => fs.unlink(path.join('backend',path.relative('http://localhost:5000',doc.imagePath))));
  // prom.then(() => res.status(200).json({ message: "Lecture deleted!" }))
  //   .catch(err => {
  //     const error = new Error(err);
  //     error.httpStatusCode = 500;
  //     return next(error);
  //   })
}

exports.findLecture = (req, res, next) =>{
  // console.log(req.params)
  Lecture.findById(req.params.id).then(lecture => {
    if (lecture) {
      res.status(200).json(lecture);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
}

exports.updateLecture = (req, res, next) =>{
  let imagePath = req.body.imagePath;
    // console.log(req.file);
    const url = req.protocol + "://" + req.get("host");
    if (req.file) {
      imagePath = url + "/images/lectures/" + req.file.filename
    }
    // lectureId = req.body._id;
    const lecture = new Lecture({
      _id: req.params.id,
      name: req.body.name,
      profession: req.body.profession,
      lectureTitle: req.body.lectureTitle,
      date: {
        "year": req.body.year,
        "month": req.body.month,
        "day": req.body.day,

      },
      regLink: req.body.regLink,
      status: req.body.status,
      imagePath: url + "/images/lectures/" + req.file.filename,
      time: req.body.time
    });

    // console.log(lecture);
    // console.log(req.body._id);
    // console.log(req.body);
    b = lecture
    // console.log(req.params.id);
    Lecture.updateOne({ _id:req.params.id }, lecture).then(result => {
      res.status(200).json({b});
    });
  }

