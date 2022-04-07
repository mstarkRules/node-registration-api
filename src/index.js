const express = require("express");
require("dotenv/config");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require("./controllers/authController")(app);

app.listen(3000);
