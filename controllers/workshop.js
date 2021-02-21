const express = require("express");
const multer = require("multer");


const Workshop = require("../models/workshop");
const fs= require('fs');
const path = require('path');
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
    cb(error, "backend/images/workshop");
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

exports.getWorkshops = (req, res, next) => {
  Workshop.find().then(documents => {
    res.status(200).json({
      message: "Workshops fetched successfully!",
      workshops : documents
    });
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });;

};


exports.addWorkshops = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
    const workshop = new Workshop({
      title: req.body.title,
      description: req.body.description,
      date: {
        "year": req.body.year,
        "month": req.body.month,
        "day": req.body.day,
      },
      regLink: req.body.regLink,
      status: req.body.status,
      price: req.body.price,
      imagePath: url + "/images/workshop/" + req.file.filename,
      time: req.body.time
    });

      b = workshop
      workshop.save().then(createdWorkshop => {
        res.status(201).json({

          b
        });
      });
};

exports.deleteWorkshop = (req, res, next) =>{
  Workshop.findByIdAndDelete(req.params.id).exec()
  .then((result) => {
    console.log(result);
    const img = path.join(path.relative('http://localhost:5000',result.imagePath));
    console.log(img);
    fs.unlink(img, err => {
      console.log(err);
    });
      res.status(200).json({ message: "Workshop deleted!" });
  }).catch((err) => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  })
}


exports.findWorkshop = (req, res, next) =>{
  // console.log(req.params)
  Workshop.findById(req.params.id).then(workshop => {
    if (workshop) {
      res.status(200).json(workshop);
    } else {
      res.status(404).json({ message: "Workshop not found!" });
    }
  });
}

exports.updateWorkshop = (req, res, next) =>{
  let imagePath = req.body.imagePath;
    // console.log(req.file);
    const url = req.protocol + "://" + req.get("host");
    if (req.file) {
      imagePath = url + "/images/workshop/" + req.file.filename;
    }
    // workshopId = req.body._id;
    const workshop = new Workshop({
      _id: req.params.id,
      title: req.body.title,
      description: req.body.description,
      date: {
        "year": req.body.year,
        "month": req.body.month,
        "day": req.body.day,
      },
      regLink: req.body.regLink,
      status: req.body.status,
      price: req.body.price,
      imagePath: url + "/images/workshop/" + req.file.filename,
      time: req.body.time
    });

    // console.log(workshop);
    // console.log(req.body._id);
    // console.log(req.body);
    // console.log(req.params.id);
    b = workshop
    Workshop.updateOne({ _id:req.params.id }, workshop).then(result => {
      res.status(200).json({b});
    });
  }


