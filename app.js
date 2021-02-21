const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require("./config.json");
const cors = require('cors')

const dotenv = require('dotenv')

const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const nodemailerConfig = require('./nodemailerConfig');
const otpGenerator = require('./otpGenerator');


const lecturesRoutes = require("./routes/lecture");
const workshopsRoutes = require("./routes/workshop");
const teamRoutes = require("./routes/team");
const competitionRoutes = require("./routes/competition");
const sponsorRoutes = require("./routes/sponsor");
const dashboardRoutes = require("./routes/dashboard");
const userRoutes = require("./routes/user");
const subscriberRoutes = require("./routes/subscriber");
const mailRoutes = require("./routes/subscribe");

const app = express();


databaseUrl = config.db.url;
mongoose
  .connect(
    databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

// app.use(bodyParser.json());

app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use(express.static(path.join(__dirname,'public')));
// app.use("/images",  cors(),express.static(path.join("backend/images")));
app.use("/images",  cors(),express.static(path.join("images")));


// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH, PUT, DELETE, OPTIONS"
//   );
//   next();
// });




const hello = '$2b$12$Fn/oeILxMCUKl2lorWc9X.tlZ.LfieUZMk/KiBYnJIUnf3PAKCLNq'
const email = "hello"
const password = "$2b$12$Q2tre2YAjH0guGtcTU.zJOs/WPa7eUcblSIjNegbDyWhwqFSLt2hK"




app.use("/api/user",  cors(),userRoutes);
app.use("/api/sendMail", cors(), mailRoutes);
app.use("/api/lectures", cors(), lecturesRoutes);
app.use("/api/workshops", cors(), workshopsRoutes);
app.use("/api/teams", cors(), teamRoutes);
app.use("/api/competitions",  cors(),competitionRoutes);
app.use("/api/sponsors",  cors(),sponsorRoutes);
app.use("/api/dashboards",  cors(),dashboardRoutes);
app.use("/api/subscriber", cors(), subscriberRoutes);
app.use("/", (req, res, next) =>{
  res.status(201).json({
    working: "api is working"
  })
})


module.exports = app;
