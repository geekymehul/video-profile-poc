import React, { useRef, useState } from 'react';
import RecordRTC from 'recordrtc';

const CamVideoRecorder = () => {
  const videoRef = useRef(null);
  const [recorder, setRecorder] = useState(null);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [facingMode, setFacingMode] = useState('user'); // 'user' for front camera, 'environment' for rear camera

  const startRecording = () => {
    const options = {
      mimeType: 'video/webm',
      bitsPerSecond: 128000,
    };
    const constraints = {
      video: { facingMode: facingMode },
      audio: true
    };
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        videoRef.current.srcObject = stream;
        const rec = new RecordRTC(stream, options);
        rec.startRecording();
        setRecorder(rec);
      })
      .catch(err => console.error('Error accessing media devices: ', err));
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stopRecording(() => {
        const blob = recorder.getBlob();
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        videoRef.current.src = url;
        videoRef.current.srcObject = null;
      });
    }
  };

  const switchCamera = () => {
    setFacingMode(prevMode => (prevMode === 'user' ? 'environment' : 'user'));
    if (recorder) {
      stopRecording();
      startRecording();
    }
  };

  const downloadRecording = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'recording.webm';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      <video ref={videoRef} controls autoPlay />
      <br />
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      <button onClick={switchCamera}>Switch Camera</button>
      <br />
      {recordedBlob && (
        <div>
          <video controls autoPlay loop>
            <source src={URL.createObjectURL(recordedBlob)} type="video/webm" />
            Your browser does not support the video tag.
          </video>
          <br />
          <button onClick={downloadRecording}>Download Recording</button>
        </div>
      )}
    </div>
  );
};

export default CamVideoRecorder;
