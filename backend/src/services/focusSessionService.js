const FocusSession = require("../models/FocusSession");

async function startSession(taskId = null, notes = "") {
  const session = await FocusSession.create({
    taskId,
    notes,
    startTime: new Date(),
    status: "active"
  });

  return session;
}

async function stopSession(sessionId) {
  const session = await FocusSession.findById(sessionId);

  if (!session) {
    throw new Error("Focus session not found");
  }

  if (session.status === "completed") {
    throw new Error("Focus session is already completed");
  }

  const endTime = new Date();
  const durationMs = endTime - session.startTime;
  const durationMinutes = Math.round(durationMs / 60000);

  session.endTime = endTime;
  session.durationMinutes = durationMinutes;
  session.status = "completed";

  await session.save();

  return session;
}

async function getSessions() {
  return FocusSession.find()
    .populate("taskId")
    .sort({ createdAt: -1 });
}

async function deleteSession(sessionId) {
  const session = await FocusSession.findByIdAndDelete(sessionId);

  if (!session) {
    throw new Error("Focus session not found");
  }

  return session;
}

module.exports = {
  startSession,
  stopSession,
  getSessions,
  deleteSession
};