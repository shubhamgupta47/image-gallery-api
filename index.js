const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
require("./db/connection");

//import routes
const photosRouter = require("./routes/photos");
const authRouter = require("./routes/auth");

const app = express();

const PORT = process.env.PORT || 3300;

// app middlewares
app.use(cors());
app.use(bodyParser.json());

//route middlewares
app.use(photosRouter);
app.use(authRouter);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
