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

app.use("/acc", require("./routes/user-mng/acc-mng-router"));

app.use(require("./routes/voting/voting-router"));

app.use(require("./routes/university/university-list-router"));

const PORT = process.env.PORT || 8000;

https
  .createServer(
    {
      key: fs.readFileSync("/etc/letsencrypt/live/ministry-backend.b4e.vn/privkey.pem"),
      cert: fs.readFileSync("/etc/letsencrypt/live/ministry-backend.b4e.vn/fullchain.pem"),
    },
    app
  )
  .listen(PORT, () => {
    console.log(`B4E Ministry Backend listening on port ${PORT}!`);
  });
