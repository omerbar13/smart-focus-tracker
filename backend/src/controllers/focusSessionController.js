const focusSessionService = require("../services/focusSessionService");

async function startSession(req, res) {
  try {
    const { taskId, notes } = req.body;

    const session = await focusSessionService.startSession(taskId, notes);

    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
}

async function stopSession(req, res) {
  try {
    const { id } = req.params;

    const session = await focusSessionService.stopSession(id);

    res.json(session);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
}

async function getSessions(req, res) {
  try {
    const sessions = await focusSessionService.getSessions();

    res.json(sessions);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}

module.exports = {
  startSession,
  stopSession,
  getSessions
};