export default function TimerDisplay({ currentSession, timeLeft }) {
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <section className="timer-display">
      <p className="session-label">{currentSession}</p>
      <p className="time">{minutes}:{seconds}</p>
    </section>
  );
}