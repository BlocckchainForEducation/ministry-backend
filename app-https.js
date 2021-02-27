const express = require("express");
const app = express();
const https = require("https");
var fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const axios = require("axios").default;
axios.defaults.baseURL = process.env.REST_API_URL;

const cors = require("cors");
app.use(cors());

const accRouter = require("./routes/user-mng/acc-mng-router");
app.use("/acc", accRouter);

const votingRouter = require("./routes/voting/voting-router");
app.use(votingRouter);

const universityRouter = require("./routes/university/university-list-router");
app.use(universityRouter);

// app.listen(8000, () => {
//   console.log("App listening on port 8000!");
// });

https
  .createServer(
    {
      key: fs.readFileSync("/etc/letsencrypt/live/ministry-backend.b4e.vn/privkey.pem"),
      cert: fs.readFileSync("/etc/letsencrypt/live/ministry-backend.b4e.vn/fullchain.pem"),
    },
    app
  )
  .listen(8000, () => {
    console.log("App listening on port 8000!");
  });
