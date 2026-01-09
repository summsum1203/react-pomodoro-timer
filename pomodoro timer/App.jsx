import { useEffect, useRef, useState } from "react";
import TimerDisplay from "./components/TimerDisplay";
import TimerControls from "./components/TimerControls";
import DurationInput from "./components/DurationInput";
import SessionInfo from "./components/SessionInfo";

const SESSION_TYPES = {
  WORK: "Work",
  SHORT_BREAK: "Short Break",
  LONG_BREAK: "Long Break",
};

export default function App() {
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);

  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState(SESSION_TYPES.WORK);
  const [completedWorkSessions, setCompletedWorkSessions] = useState(0);
  const [workSessionsInCycle, setWorkSessionsInCycle] = useState(0);

  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!isRunning) {
      if (currentSession === SESSION_TYPES.WORK) setTimeLeft(workDuration * 60);
      if (currentSession === SESSION_TYPES.SHORT_BREAK) setTimeLeft(shortBreakDuration * 60);
      if (currentSession === SESSION_TYPES.LONG_BREAK) setTimeLeft(longBreakDuration * 60);
    }
  }, [workDuration, shortBreakDuration, longBreakDuration, currentSession, isRunning]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          handleSessionEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  function handleSessionEnd() {
    audioRef.current?.play().catch(() => {});

    if (currentSession === SESSION_TYPES.WORK) {
      setCompletedWorkSessions(prev => prev + 1);
      setWorkSessionsInCycle(prev => {
        const newCount = prev + 1;
        if (newCount >= 4) {
          setCurrentSession(SESSION_TYPES.LONG_BREAK);
          setTimeLeft(longBreakDuration * 60);
          return 0;
        }
        setCurrentSession(SESSION_TYPES.SHORT_BREAK);
        setTimeLeft(shortBreakDuration * 60);
        return newCount;
      });
    } else {
      setCurrentSession(SESSION_TYPES.WORK);
      setTimeLeft(workDuration * 60);
    }

    setIsRunning(false);
  }

  function handleStart() {
    if (timeLeft > 0) setIsRunning(true);
  }

  function handlePause() {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  }

  function handleReset() {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setCompletedWorkSessions(0);
    setWorkSessionsInCycle(0);
    setCurrentSession(SESSION_TYPES.WORK);
    setTimeLeft(workDuration * 60);
  }

  return (
    <div className="app">
      <div className="pomodoro">
        <SessionInfo
          currentSession={currentSession}
          completedWorkSessions={completedWorkSessions}
        />

        <TimerDisplay
          currentSession={currentSession}
          timeLeft={timeLeft}
        />

        <TimerControls
          isRunning={isRunning}
          timeLeft={timeLeft}
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
        />

        <div className="settings">
          <DurationInput label="Work" value={workDuration} onChange={setWorkDuration} />
          <DurationInput label="Short Break" value={shortBreakDuration} onChange={setShortBreakDuration} />
          <DurationInput label="Long Break" value={longBreakDuration} onChange={setLongBreakDuration} />
        </div>

        <audio
          ref={audioRef}
          src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
          preload="auto"
        />
      </div>
    </div>
  );
}