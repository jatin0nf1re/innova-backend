const express = require("express");
const multer = require("multer");
const Subscribe = require("../models/subscribe");
const fs= require('fs');
const path = require('path');
const nodemailer = require('nodemailer')
const Subscriber = require("../models/subscriber");
const config = require('../nodemailerConfig.json');
const { type } = require("jquery");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images/mail");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

exports.sendmails = async (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const subscribe = new Subscribe({
    subject: req.body.subject,
    content: req.body.content,
    imagePath: url + "/images/mail/" + req.file.filename,
  });


  b = req.body;
  console.log("sending mails");
  console.log(b);
  subscribe.save().then((createSubscribe) => {
    res.status(201).json({
      message: "Subscribe added successfully",
      b,
    });
  });

  // console.log(req.body);
  // console.log(req.file)
  // console.log(req.file.path)
  if (!req.body.content || !req.body.subject) {
    res.status(400).send("ERROR: Some form data is missing.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: config.fromMail, // Set this in environment var
      pass: config.pass, // Set this in environment var
    },
  });

  //for sending multiple recipients simply assign array of mails to 'to'
  // const mailList = ["nitishkumar12c@gmail.com"];
  var mailList = [];
   console.log(typeof(mailList));
   Subscriber.find().then(document =>{
    for(i =  0;i<document.length;i++){

      console.log(document[i]["email"]);
      mailList.push(document[i].email);
      // console.log(mailList + "mia");
    }
    return mailList;
  })
  .then((mailList) =>{
    console.log(mailList + "niche hui hai");
    const mailOptions = {
      from: config.fromMail,
      to: mailList,
      subject: req.body.subject,
      // Email body.
      text: req.body.content,
      //array of objects for attachments
      attachments: [
        {
          filename: "",
          path: req.file.path
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res
          .status(500)
          .send(`Something went wrong. Unable to send email\nERROR:\n${error}`);
        } else {
        console.log(`Email sent: ${info.response}`);
        // console.log(mailList);
      }
    });

  })


  // console.log(maildoc)

};
