const express = require("express");
const router = express.Router();
const connection = require("../../db");
const COLL_NAME = "University";
const { authen } = require("../user-mng/protect-middleware");

router.get("/universities", authen, async (req, res) => {
  try {
    const col = (await connection).db().collection(COLL_NAME);
    const universities = await col.find({}).toArray();
    res.json(universities);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
