require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

/*  EXPRESS */
const express = require("express");
const app = express();
const session = require("express-session");

app.set("view engine", "ejs");

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);

// Swagger

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Docs",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["index.js"],
};

const YAML = require('yamljs')
const openapiSpecification = YAML.load('./api.yaml')
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));


app.get("/", function (req, res) {
  // res.render("pages/auth");
  res.status(200).send("It is Working");
});

app.get("/users", function (req, res) {
  const userData = [{
    id : 1,
    Name: "Soham",
    favSinger: "The Weeknd",
    song: "Satrboy",
  },
  {
    id : 2,
    Name: "Soham",
    favSinger: "The Weeknd",
    song: "Call Out My Name",
  },
  {
    id:3,
    Name: "Rock",
    favSinger: "Pritam",
    song: "Tere Hoke Rehenge",
  }
];
  res.status(200).send(userData);
});

app.get("/users/:id", function (req, res) {
  const userData = [{
    id : 1,
    Name: "Soham",
    favSinger: "The Weeknd",
    song: "Satrboy",
  },
  {
    id : 2,
    Name: "Soham",
    favSinger: "The Weeknd",
    song: "Call Out My Name",
  },
  {
    id:3,
    Name: "Rock",
    favSinger: "Pritam",
    song: "Tere Hoke Rehenge",
  }
];
  const response = userData.find((elem)=> elem.id === parseInt(req.params.id))
  res.status(200).send(response);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("App listening on port " + port));

// index.js

/*  PASSPORT SETUP  */

const passport = require("passport");
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

app.get("/success", (req, res) => res.send(userProfile));
app.get("/error", (req, res) => res.send("error logging in"));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

// index.js

/*  Google AUTH  */

const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      return done(null, userProfile);
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/error" }),
  function (req, res) {
    // Successful authentication, redirect success.
    res.redirect("/success");
  }
);
