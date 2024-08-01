import React, { useState, useEffect } from 'react';

const Timer = () => {
  // State to keep track of the elapsed time in seconds
  const [time, setTime] = useState(0);
  // State to control whether the timer is running or paused
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // If the timer is running, set up the interval to update the time every second
    let timerInterval;
    if (isRunning) {
      timerInterval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000); // Update every second
    }

    // Clean up the interval when the component unmounts or the timer is stopped
    return () => clearInterval(timerInterval);
  }, [isRunning]);

  // Format the time in minutes and seconds
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(()=> {
    setIsRunning(true);
  },[]);

  return (
    <div>
      <h1>Timer</h1>
      <div>
        <p>{formatTime(time)}</p>
      </div>
    </div>
  );
};

export default Timer;
