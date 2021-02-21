const express = require("express");


const Subscriber = require("../models/subscriber");

const router = express.Router();
const fs= require('fs');
const path = require('path');

exports.getSubscribers = (req, res, next) => {
  Subscriber.find().then(documents => {
    res.status(200).json({
      message: "subscriber fetched successfully!",
      subscribers: documents
    });
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });;

};


exports.addSubscriber = async (req, res, next) => {



 try{

    console.log(req.body);
    const subscriber = new Subscriber({

     name: req.body.name,
     email: req.body.email,
     phone: req.body.phone
    });
    // imagePath: result.public_id,


      b = subscriber
      console.log("done");
      console.log(b);
      await subscriber.save().then(createdPost => {
        res.status(201).json({
          b
        });
      }
      )}

      catch (err) {
        console.log(err);
      }

};






