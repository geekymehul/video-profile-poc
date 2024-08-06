import React, { useEffect, useRef, useState } from 'react';
import Wavesurfer from 'wavesurfer.js';

const InputAudioPlayer = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [wavesurfer, setWavesurfer] = useState(null);
  const wavesurferRef = useRef(null);

  useEffect(() => {
    // Initialize Wavesurfer instance
    const ws = Wavesurfer.create({
      container: wavesurferRef.current,
      waveColor: '#eee',
      progressColor: '#3b5998',
      height: 128,
      responsive: true,
    });
    setWavesurfer(ws);

    // Cleanup on unmount
    return () => ws.destroy();
  }, []);

  useEffect(() => {
    // Load audio file into Wavesurfer
    if (wavesurfer && audioFile) {
      const objectUrl = URL.createObjectURL(audioFile);
      wavesurfer.load(objectUrl);

      // Cleanup object URL after loading
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [wavesurfer, audioFile]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const play = () => {
    wavesurfer && wavesurfer.play();
  };

  const pause = () => {
    wavesurfer && wavesurfer.pause();
  };

  return (
    <div>
      <input type="file" accept=".m4a,.mp3,.wav" onChange={handleFileChange} />
      <div ref={wavesurferRef} />
      <button onClick={play}>Play</button>
      <button onClick={pause}>Pause</button>
    </div>
  );
};

export default InputAudioPlayer;
