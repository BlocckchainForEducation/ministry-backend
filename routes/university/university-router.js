const express = require("express");
const router = express.Router();
const connection = require("../../db");
const DB_NAME = "B4E_Ministry_Backend";
const COLL_NAME = "University";

router.get("/universities", async (req, res) => {
  try {
    const col = (await connection).db(DB_NAME).collection(COLL_NAME);
    const universities = await col.find({}).toArray();
    res.json(universities);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
