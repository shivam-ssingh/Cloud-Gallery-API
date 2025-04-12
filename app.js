const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/folders", require("./routes/folder"));
app.use("/api/images", require("./routes/images"));

module.exports = app;
