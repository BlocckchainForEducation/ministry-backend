const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const axios = require("axios").default;
axios.defaults.baseURL = process.env.REST_API_URL;

const { initMinistryAccount, initMinistryProfile } = require("./init");

const cors = require("cors");
app.use(cors());

app.use("/acc", require("./routes/user-mng/acc-mng-router"));
app.use("/api/v1.2/events", require("./routes/events"));
app.use("/api/v1.2", require("./routes/voting/voting-router"));
app.use("/api/v1.2", require("./routes/university/university-list-router"));

app.listen(8000, () => {
  initMinistryAccount();
  initMinistryProfile();
  console.log("App listening on port 8000!");
});
