const express = require("express");
const router = express.Router();
const connection = require("../../db");
const { DB_NAME } = require("../../constance");
const COLL_NAME = "University";
const { authen } = require("../user-mng/protect-middleware");

router.get("/universities", authen, async (req, res) => {
  try {
    const col = (await connection).db(DB_NAME).collection(COLL_NAME);
    const universities = await col.find({}).toArray();
    res.json(universities);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
