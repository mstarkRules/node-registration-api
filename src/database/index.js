const mongoose = require("mongoose");
require("dotenv/config");

const uri = `mongodb+srv://mstark:${process.env.MONGO_PASSWORD}@cluster0.pifsb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose.connect(uri);

mongoose.Promise = global.Promise;

module.exports = mongoose;
