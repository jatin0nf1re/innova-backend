const express = require("express");
const multer = require("multer");

const fs= require('fs');
const path = require('path');
const Sponsor = require("../models/sponsor");

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
    cb(error, "backend/images/sponsor");
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

exports.getSponsors = (req, res, next) => {
  Sponsor.find().then(documents => {
    res.status(200).json({
      message: "Sponsors fetched successfully!",
      sponsors: documents
    });
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });;

};


exports.addSponsor = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
    const sponsor = new Sponsor({
      sponsorName: req.body.sponsorName,
      sponsorTitle: req.body.sponsorTitle,
      year: req.body.year,
      link: req.body.link,
      status: req.body.status,
      imagePath: url + "/images/sponsor/" + req.file.filename
    });

      b = sponsor
      sponsor.save().then(createSponsor => {
        res.status(201).json({

          b
        });
      });
};

exports.deleteSponsor = (req, res, next) =>{
  Sponsor.findByIdAndDelete(req.params.id).exec()
  .then((result) => {
    console.log(result);
    const img = path.join(path.relative('http://localhost:5000',result.imagePath));
    console.log(img);
    fs.unlink(img, err => {
      console.log(err);
    });
      res.status(200).json({ message: "Sponsor deleted!" });
  }).catch((err) => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  })
}

exports.findSponsor = (req, res, next) =>{
  // console.log(req.params)
  Sponsor.findById(req.params.id).then(sponsor => {
    if (sponsor) {
      res.status(200).json(sponsor);
    } else {
      res.status(404).json({ message: "Sponsor not found!" });
    }
  });
}

exports.updateSponsor = (req, res, next) =>{
  let imagePath = req.body.imagePath;
    // console.log(req.file);
    const url = req.protocol + "://" + req.get("host");
    if (req.file) {
      imagePath = url + "/images/sponsor/" + req.file.filename;
    }
    // sponsorId = req.body._id;
    const sponsor = new Sponsor({
      _id: req.params.id,
      sponsorName: req.body.sponsorName,
      sponsorTitle: req.body.sponsorTitle,
      year: req.body.year,
      link: req.body.link,
      status: req.body.status,
      imagePath: url + "/images/sponsor/" + req.file.filename
    });

    b = sponsor
    // console.log(sponsor);
    // console.log(req.body._id);
    // console.log(req.body);
    // console.log(req.params.id);
    Sponsor.updateOne({ _id:req.params.id }, sponsor).then(result => {
      res.status(200).json({ b});
    });
  }


