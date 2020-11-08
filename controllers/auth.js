const jwt = require("jsonwebtoken");
const shortId = require("shortid");
const expressJwt = require("express-jwt");

// relative imports
const User = require("../models/users");

/**
 * REGISTER
 */
exports.register = (req, res) => {
  const { name, email, password } = req.body;

  // check if user already exists in database
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "email already exists",
      });
    }

    const username = shortId.generate();

    // registering new user
    const newUser = new User({ username, name, email, password });

    newUser.save((err, user) => {
      if (err) {
        return res.status(401).json({
          error: `
            Something went wrong while saving saving the user in databse.
            Please try again later.
          `,
        });
      }
      return res.json({
        message: "Registration successful. You can now login",
      });
    });
  });
};

/**
 * LOGIN
 */
exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (err) {
      return res.status(400).json({
        error: "Something went wrong. Please try again",
      });
    }
    if (!user) {
      return res.status(404).json({
        error:
          "The account with this email was not found. Please create a new one.",
      });
    }

    // authenticate
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and password don't match. Please try again.",
      });
    }

    // generate token and send to client
    const { _id, name, email, role } = user;
    const token = jwt.sign({ _id }, process.env.JWT_SECRET);
    //Put Token in cookie
    res.cookie("token", token), { expire: new Date() + 1 };
    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

// auth middleware

exports.requiresSignIn = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["sha1", "RS256", "HS256"],
});

exports.isAuthenticatedMiddleware = (req, res, next) => {
  const authUserId = req.user._id;

  User.findOne({ _id: authUserId }).exec((err, user) => {
    if (err || !user) {
      res.status(400).json({
        error: "Unidentified user",
      });
    }

    req.profile = user;
    next();
  });
};
