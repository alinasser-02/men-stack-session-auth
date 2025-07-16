require("dotenv").config();
const express = require("express");
const app = express();
const methodOverride = require("method-override");
const morgan = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const port = process.env.PORT ? process.env.PORT : "3000";
const authController = require("./controllers/authController");
const isSignedIn = require('./middleware/is-signed-in')
// if (process.env.PORT) {
//   const port = process.env.PORT;
// } else {
//   const port = "3000";
// }

// DATABASE CONNECTION
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`connected ${mongoose.connection.name}`);
});

//MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

app.get("/", (req, res) => {
  res.render("index.ejs", { title: "My App", user: req.session.user });
});

// ROUTES
app.use("/auth", authController);
app.use(isSignedIn)
app.get('/vip-lounge',(req,res)=>{
  res.send(`welcome ${req.session.user.username}`)
})
app.listen(port, () => {
  console.log(`the express app is ready on port${port}`);
});


