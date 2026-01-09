export default function TimerControls({ isRunning, timeLeft, onStart, onPause, onReset }) {
  return (
    <section className="timer-controls">
      <button onClick={isRunning ? onPause : onStart}>
        {isRunning ? "Pause" : timeLeft === 0 ? "Resume" : "Start"}
      </button>

      <button onClick={onReset}>
        Reset
      </button>
    </section>
  );
}