const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
//passport config
require("./config/passport")(passport);
const app = express();
const indexRouter = require("./routes/index");
const userRouter = require("./routes/users");
//DB configuration
const dbServer = require("./config/keys").MongoUrl;
mongoose
  .connect(dbServer, { useNewUrlParser: true })
  .then(() => console.log("Mongo DB connected!"))
  .catch(error => next(err));
//ejs
app.use(expressLayouts);
app.set("view engine", "ejs"); //views folder by default

app.use(express.static(path.join(__dirname, "public")));
//BodyParser
app.use(express.urlencoded({ extended: false })); //same as bodyParser.urlencoded
//Express session
app.use(
  session({
    secret: "secret string",
    resave: true,
    saveUninitialized: true
  })
);
//passport middleware
app.use(passport.initialize());
app.use(passport.session());
//connect flash
app.use(flash());
//Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  console.log("\n my globals ", res.locals);
  next();
});
//Routes
app.use("/", indexRouter);
app.use("/users", userRouter);
//handling inexisted pages
app.use((req, res, next) => {
  const error = new Error("page not found");
  error.status = 404; //not found
  next(error);
});
//handling error
app.use((err, req, res, next) => {
  res.status(err.status || 500).render("error", {
    errorMessage: err.message || "Some thing went wrong,Please try again later!"
  });
});
const PORT = process.env.PORT || 500;
app.listen(PORT, error => {
  console.log(`Server started on port ${PORT}`);
});
