import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const playerRef = useRef(null);

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    setPlaying((prevPlaying) => !prevPlaying);
  };

  // Update duration when it's available
  const handleDuration = (duration) => {
    setDuration(duration);
  };

  // Update current time on progress
  const handleProgress = (progress) => {
    setCurrentTime(progress.playedSeconds);
  };

  return (
    <div>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
      />
      <div>
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          playing={playing}
          controls={true}
          playsinline={true}
          width="100%"
          height="auto"
          onDuration={handleDuration} // Set duration when available
          onProgress={handleProgress} // Update current time on progress
        />
      </div>
      <button onClick={togglePlayPause}>
        {playing ? 'Pause' : 'Play'}
      </button>
      <div>
        {duration !== null && (
          <p>Total Duration: {formatDuration(duration)}</p>
        )}
        <p>Current Time: {formatDuration(currentTime)}</p>
      </div>
    </div>
  );
};

// Helper function to format duration
const formatDuration = (duration) => {
  if (!duration) return '0:00';
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default VideoPlayer;
