const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const router = require("./routes/index");
app.use(router);





app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
