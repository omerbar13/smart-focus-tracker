import FocusSession, { IFocusSession } from "../models/FocusSession";

/**
 * Start a new focus session.
 *
 * Currently allows starting without a taskId. We'll likely tighten this
 * in M2 once we have proper user context (a session should always belong
 * to a real, owned task).
 */
export async function startSession(
  taskId: string | null = null,
  notes: string = ""
): Promise<IFocusSession> {
  return FocusSession.create({
    taskId,
    notes,
    startTime: new Date(),
    status: "active",
  });
}

/**
 * Stop an active focus session. Computes duration on the server side
 * (we never trust client-supplied durations).
 *
 * Throws if the session doesn't exist or is already completed.
 */
export async function stopSession(sessionId: string): Promise<IFocusSession> {
  const session = await FocusSession.findById(sessionId);

  if (!session) {
    throw new Error("Focus session not found");
  }

  if (session.status === "completed") {
    throw new Error("Focus session is already completed");
  }

  const endTime = new Date();
  const durationMs = endTime.getTime() - session.startTime.getTime();
  const durationMinutes = Math.round(durationMs / 60000);

  session.endTime = endTime;
  session.durationMinutes = durationMinutes;
  session.status = "completed";

  return session.save();
}

/**
 * Get all focus sessions, populated with their related task,
 * newest first.
 */
export async function getSessions(): Promise<IFocusSession[]> {
  return FocusSession.find()
    .populate("taskId")
    .sort({ createdAt: -1 });
}

/**
 * Delete a focus session by ID.
 *
 * Throws if the session does not exist. (We throw here rather than returning
 * null because the controller currently relies on the throw-as-flow pattern;
 * we'll clean this up when we add the global error handler.)
 */
export async function deleteSession(sessionId: string): Promise<IFocusSession> {
  const session = await FocusSession.findByIdAndDelete(sessionId);

  if (!session) {
    throw new Error("Focus session not found");
  }

  return session;
}