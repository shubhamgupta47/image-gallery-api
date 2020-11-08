const mongoose = require("mongoose");
const crypto = require("crypto");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      max: 18,
      index: true,
      lowercase: true,
      required: true,
    },
    name: {
      type: String,
      trim: true,
      max: 42,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      lowercase: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: String,
      default: "subscriber",
    },
    resetPasswordLink: {
      data: String,
      default: "",
    },
  },
  { timestamps: true }
);

// virtual fields
userSchema
  .virtual("password")

  .set(function (password) {
    // create a temp variable
    this._password = password;
    // generate salt
    this.salt = this.makeSalt();
    // encrypt password
    this.hashed_password = this.encryptPassword(password);
  })

  .get(function () {
    return this._password;
  });

// methods => authenticate, encryptPassword, makeSalt
userSchema.methods = {
  authenticate: function (plainTextPassword) {
    return this.encryptPassword(plainTextPassword) === this.hashed_password;
  },
  encryptPassword: function (password) {
    if (!password) {
      return "";
    }
    try {
      return crypto
        .createHmac("sha1", this.salt) // params: algo, key
        .update(password)
        .digest("hex");
    } catch (error) {
      return "";
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

module.exports = mongoose.model("User", userSchema);
