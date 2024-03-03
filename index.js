const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const connectToDB = require("./src/configs/db.config");
const auth = require("./src/routes/auth.route");
const teacher = require("./src/routes/teacher.route");
const group = require("./src/routes/group.route");
const student = require("./src/routes/student.route");

const app = express();
const port = process.env.PORT || 3000;

connectToDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/api/auth", auth);
app.use("/api/teacher", teacher);
app.use("/api/group", group);
app.use("/api/student", student);
app.use("/", views);

app.listen(port, function () {
  console.log(`App is running on port: ${port}`);
});
