import React, { useState, useEffect, useRef } from 'react';

const ProgressBar = ({togglePlayPause,isPlaying,time}) => {
//   const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isPlaying]);


  const resetTimer = () => {
    setCurrentTime(0);
   
  };

  isPlaying&&setTimeout(()=>{
   resetTimer()
  },time)

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const progressBarWidth = (currentTime / 20) * 200; // Adjust the value based on your desired duration

  return (
    <div>
      <div style={{ width: '100px', height: '20px', backgroundColor: '#ddd', borderRadius: '4px', marginBottom: '10px' }}>
        <div
          style={{ width: `${progressBarWidth}%`, height: '100%', backgroundColor: '#4caf50', borderRadius: '4px' }}
        ></div>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <button onClick={togglePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
        
      </div>

      <div>{formatTime(currentTime)}</div>
    </div>
  );
};

export default ProgressBar;
