const express = require("express");
const app = express();
const https = require("https");
var fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// require("dotenv").config({ path: `.env.production` }); // use docker compose env_file
const axios = require("axios").default;
axios.defaults.baseURL = process.env.REST_API_URL;

const { initMinistryAccount, initMinistryProfile } = require("./init");

const cors = require("cors");
app.use(cors());

app.use("/acc", require("./routes/user-mng/acc-mng-router"));
app.use("/api/v1.2/events", require("./routes/events"));
app.use("/api/v1.2", require("./routes/voting/voting-router"));
app.use("/api/v1.2", require("./routes/university/university-list-router"));

const PORT = process.env.PORT || 8000;

https
  .createServer(
    {
      key: fs.readFileSync("/run/secrets/privkey"), // use docker-compose secrets
      cert: fs.readFileSync("/run/secrets/fullchain"), // use docker-compose secrets
    },
    app
  )
  .listen(PORT, () => {
    initMinistryAccount();
    initMinistryProfile();
    console.log(`B4E Ministry Backend listening on port ${PORT}!`);
  });
