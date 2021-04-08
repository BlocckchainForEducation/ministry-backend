const connection = require("./db");
const bcrypt = require("bcryptjs");
const ministryProfile = require("./resources/MinistryProfile.json");

async function initMinistryProfile() {
  const col = (await connection).db().collection("MinistryProfile");
  const doc = await col.findOne({});
  if (!doc) {
    await col.insertOne(ministryProfile);
  }
}

async function initMinistryAccount() {
  try {
    const col = (await connection).db().collection("Account");
    const email = process.env.MINISTRY_ACCOUNT_EMAIL;
    const acc = await col.findOne({ email: email });
    if (!acc) {
      const password = process.env.MINISTRY_ACCOUNT_PASSWORD;
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      await col.insertOne({ email, hashedPassword });
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = { initMinistryProfile, initMinistryAccount };
