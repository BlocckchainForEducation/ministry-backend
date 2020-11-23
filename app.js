const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
require("dotenv").config();

const cors = require("cors");
app.use(cors());

const votingRouter = require("./routes/voting/voting-router");
app.use("/voting", votingRouter);

app.listen(8000, () => {
  console.log("App listening on port 8000!");
});
