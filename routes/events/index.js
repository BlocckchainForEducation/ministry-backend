const express = require("express");
const connection = require("../../db");
const router = express.Router();

// FIXME: need authen, author too!
router.post("/registration", async (req, res) => {
  try {
    const profile = req.body.profile;
    (await connection)
      .db()
      .collection("UniversityProfile")
      .insertOne({ ...profile, votes: [] });

    (await connection)
      .db()
      .collection("Ballot")
      .insertOne({ ...profile, state: "new" });
    return res.send("ok");
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.toString());
  }
});

// TODO: need txid in req.body too!
router.post("/vote", async (req, res) => {
  try {
    // console.log({ body: req.body });
    const ministry = await (await connection).db().collection("MinistryProfile").findOne({});
    const universityColl = (await connection).db().collection("UniversityProfile");
    // find who is the voter
    let voter;
    if (req.body.publicKey === ministry.publicKey) {
      voter = ministry;
    } else {
      voter = await universityColl.findOne({ publicKey: req.body.publicKey });
    }
    // update in UniversityProfile
    await universityColl.updateOne(
      { publicKey: req.body.requesterPublicKey },
      {
        $push: {
          votes: { ...voter, decision: req.body.decision },
        },
      }
    );

    return res.send("ok");
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.toString());
  }
});

router.post("/vote-closed", async (req, res) => {
  try {
    const universityColl = (await connection).db().collection("UniversityProfile");
    await universityColl.updateOne(
      { publicKey: req.body.requesterPublicKey },
      { $set: { state: req.body.finalState, voteCloseDate: new Date().toISOString.split("T")[0] } }
    );

    return res.send("ok");
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.toString());
  }
});

module.exports = router;
