import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const PomodoroClock = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerLabel, setTimerLabel] = useState("Session");
  const [isRunning, setIsRunning] = useState(false);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 0) {
            audioRef.current.play();
            if (timerLabel === "Session") {
              setTimerLabel("Break");
              return breakLength * 60;
            } else {
              setTimerLabel("Session");
              return sessionLength * 60;
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, breakLength, sessionLength, timerLabel]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerLabel("Session");
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleLengthChange = (type, change) => {
    if (isRunning) return;
    if (type === "break") {
      setBreakLength((prev) => {
        const newValue = prev + change;
        return newValue > 0 && newValue <= 60 ? newValue : prev;
      });
    } else {
      setSessionLength((prev) => {
        const newValue = prev + change;
        if (newValue > 0 && newValue <= 60) {
          setTimeLeft(newValue * 60);
          return newValue;
        }
        return prev;
      });
    }
  };

  return (
    <div className="pomodoro-clock">
      <h1>25 + 5 Clock</h1>
      <div className="length-controls">
        <div>
          <h2 id="break-label">Break Length</h2>
          <button
            id="break-decrement"
            onClick={() => handleLengthChange("break", -1)}
          >
            -
          </button>
          <span id="break-length">{breakLength}</span>
          <button
            id="break-increment"
            onClick={() => handleLengthChange("break", 1)}
          >
            +
          </button>
        </div>
        <div>
          <h2 id="session-label">Session Length</h2>
          <button
            id="session-decrement"
            onClick={() => handleLengthChange("session", -1)}
          >
            -
          </button>
          <span id="session-length">{sessionLength}</span>
          <button
            id="session-increment"
            onClick={() => handleLengthChange("session", 1)}
          >
            +
          </button>
        </div>
      </div>
      <div className="timer">
        <h2 id="timer-label">{timerLabel}</h2>
        <div id="time-left">{formatTime(timeLeft)}</div>
      </div>
      <div className="controls">
        <button id="start_stop" onClick={handleStartStop}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button id="reset" onClick={handleReset}>
          Reset
        </button>
      </div>
      <audio
        id="beep"
        ref={audioRef}
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      />
    </div>
  );
};

export default PomodoroClock;
