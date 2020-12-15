const express = require("express");
const router = express.Router();
const connection = require("../../db");
const UNIVERSITY_PROFILE = "UniversityProfile";
const { authen } = require("../user-mng/protect-middleware");

router.get("/universities", authen, async (req, res) => {
  try {
    const col = (await connection).db().collection(UNIVERSITY_PROFILE);
    const universities = await col.find({ state: "accepted" }).toArray();
    res.json(universities);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
