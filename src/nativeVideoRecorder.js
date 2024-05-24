import React, { useState, useRef } from "react";

// let mimeType = 'video/webm;codecs=h264';
// let mimeType = "video/x-matroska;codecs=avc1";
let mimeType = 'video/webm;codecs=vp9';



const NativeVideoRecorder =(props) => {
  const [stream, setStream] = useState(null);
  const [blob, setBlob] = useState(null);
  const [videoUrl,setVideoUrl] = useState(null);

  const refVideo = useRef(null);
  const refRecordingElem = useRef(null);
  const recorderRef = useRef(null);
  const videoChunks = useRef([]);
  const recorderVideoChunks = useRef([]);

  const handleRecording = async () => {
    setBlob(null);
    setVideoUrl(null);
    let options;
    if (MediaRecorder.isTypeSupported('video/webm; codecs=vp9')) {
      options = {mimeType: 'video/webm; codecs=vp9'};
  } else if (MediaRecorder.isTypeSupported('video/mp4')) {
    options = {mimeType: 'video/mp4', videoBitsPerSecond : 100000};
  }
    navigator.mediaDevices.getUserMedia({ video: true, audio: {echoCancellation: true,
      noiseSuppression: true} }).then(mediaStream => {
        // create the recorder
        recorderRef.current = new MediaRecorder(mediaStream, options);
        setStream(mediaStream);
        // starts recording
        recorderRef.current.start();
        // sets video element to use the stream
        refRecordingElem.current.srcObject = mediaStream;
        // sets the video element to autoplay, otherwise user would have to click play
        refRecordingElem.current.autoplay = true;
        
        let localAudioChunks = [];
        recorderRef.current.ondataavailable = event => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;
            localAudioChunks.push((event.data));
        };
        videoChunks.current = localAudioChunks;
    });
  };

  const handleStop = () => {
    if(recorderRef.current) {
        //stops the recording instance
        recorderRef.current.stop();
        recorderRef.current.onstop = () => {
            //creates a blob file from the videochunks data
            const videoBlob = new Blob(videoChunks.current, { type: mimeType });
            //creates a playable URL from the blob file.
            const videoDownUrl = URL.createObjectURL(videoBlob);
            setVideoUrl(videoDownUrl);
            recorderVideoChunks.current = videoChunks.current;
            videoChunks.current = [];
        };
    }
  };


  return (
    <div className="video">
      <div>Video Recording</div>
      <header className="video-header">
        <button onClick={handleRecording}>start</button>
        <button onClick={handleStop}>stop</button>
        {videoUrl ? <>
          <video
            src={videoUrl}
            controls
            autoPlay
            ref={refVideo}
            style={{ width: "350px" }}
          />
          <a download href={videoUrl}>Native Download Recording</a>
        </> : <video ref={refRecordingElem}
                style={{ width: "350px" }}
                autoPlay />}
      </header>
    </div>
  );
};

export default NativeVideoRecorder;