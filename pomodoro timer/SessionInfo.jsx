export default function SessionInfo({ currentSession, completedWorkSessions }) {
  return (
    <section className="session-info">
      <div>
        <p className="label">Current session</p>
        <p className="value">{currentSession}</p>
      </div>

      <div>
        <p className="label">Work sessions</p>
        <p className="value">{completedWorkSessions}</p>
      </div>
    </section>
  );
}