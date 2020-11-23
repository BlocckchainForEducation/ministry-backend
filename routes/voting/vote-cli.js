function sendAcceptVote() {
  return Promise.resolve({ ok: true });
}

function sendDeclineVote() {
  return Promise.resolve({ ok: true });
}

module.exports = { sendAcceptVote, sendDeclineVote };
