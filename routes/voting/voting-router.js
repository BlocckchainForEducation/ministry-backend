const express = require("express");
const router = express.Router();
const connection = require("../../db");
const DB_NAME = "B4E_Ministry_Backend";
const COLL_NAME = "VoteRequest";
const voteCli = require("./vote-cli");
var ObjectId = require("mongodb").ObjectId;

router.get("/vote-requests", async (req, res) => {
  try {
    const col = (await connection).db(DB_NAME).collection(COLL_NAME);
    const state = req.query.state;
    let votes;
    if (state === "new") {
      votes = await col.find({ state: "new" }).toArray();
    } else if (state === "old") {
      votes = await col.find({ state: { $in: ["accepted", "declined"] } }).toArray();
    } else {
      votes = await col.find({}).toArray();
    }
    res.json(votes);
  } catch (error) {
    res.status(500).json(error);
  }
});

// router.post("/accept", async (req, res) => {
//   try {
//     const opResult = await voteCli.sendAcceptVote();
//     if (opResult.ok) {
//       const col = (await connection).db(DB_NAME).collection(COLL_NAME);
//       const updateResult = await col.updateOne({ _id: req.body._id }, { $set: { status: "accepted" } });
//       res.json(updateResult);
//     } else {
//       res.status(500).json(opResult);
//     }
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

// router.post("/decline", async (req, res) => {
//   try {
//     const opResult = await voteCli.sendDeclineVote();
//     if (opResult.ok) {
//       const col = (await connection).db(DB_NAME).collection(COLL_NAME);
//       const updateResult = await col.updateOne({ _id: req.body._id }, { $set: { status: "declined" } });
//       res.json(updateResult);
//     } else {
//       res.status(500).json(opResult);
//     }
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

router.post("/vote", async (req, res) => {
  try {
    const vote = req.query.vote;
    const _id = req.query._id;
    if (!vote || !_id) {
      return res.status(400).json({ ok: false, msg: "vote and _id is require" });
    }
    let opResult;

    if (vote === "accept") {
      opResult = await voteCli.sendAcceptVote();
    } else if (vote === "decline") {
      opResult = await voteCli.sendDeclineVote();
    } else {
      return res.status(400).json({ ok: false, msg: "vote == accept || vote == decline" });
    }

    if (opResult.ok) {
      const col = (await connection).db(DB_NAME).collection(COLL_NAME);
      const state = vote === "accept" ? "accepted" : "declined";
      const updateResult = await col.updateOne({ _id: new ObjectId(_id) }, { $set: { state: state } });
      res.json(updateResult);
    } else {
      res.status(500).json(opResult);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
