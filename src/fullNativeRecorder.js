import React, { useState, useRef } from "react";

// let mimeType = 'video/webm;codecs=h264';
// let mimeType = "video/x-matroska;codecs=avc1";
let mimeType = 'video/webm;codecs=vp9';



const FullNativeVideoRecorder =(props) => {
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

    try {
      if (MediaRecorder.isTypeSupported('video/webm; codecs=vp9')) {
        mimeType = 'video/webm; codecs=vp9';
        options = {mimeType: 'video/webm; codecs=vp9', width: { exact: 640 },
        height: { exact: 360 }};
      } else if (MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4';
        // options = {mimeType: 'video/mp4', videoBitsPerSecond : 100000};
        options = {mimeType: 'video/mp4'};
      } else {
        alert("Recording Media is not supported in your device!")
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
          // open video in fullscreen
          refRecordingElem.current.parentElement.requestFullscreen();
          
          let localAudioChunks = [];
          recorderRef.current.ondataavailable = event => {
              if (typeof event.data === "undefined") return;
              if (event.data.size === 0) return;
              localAudioChunks.push((event.data));
          };
          videoChunks.current = localAudioChunks;
      }).catch((e)=> {
        console.log(e)
        alert(e.message);
      });
    } catch(e) {
      console.log(e)
      alert(e.message);
    }

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
            // exit fullscreen
            document.exitFullscreen();
            if(stream) {
              stream.getTracks().forEach(function(track) {
                track.stop();
              });
            }
        };
    }
  };

  const width = window.innerWidth;
  const height = window.innerHeight;

  return (
    <div className="video">
      <div>Full screen Video Recording</div>
      <header className="video-header">
        <button onClick={handleRecording} className="btn-start">start</button>
        <button onClick={handleStop} className="btn-stop">stop</button>
        {videoUrl ? <div>
          <video
            src={videoUrl}
            controls
            autoPlay
            playsInline
            ref={refVideo}
            style={{ width: "350px" }}
            >
          </video>
          <a download href={videoUrl}>Native Download Recording</a>
        </div> : <video ref={refRecordingElem}
                style={{ width, height }}
                className="record-video"
                playsInline
                muted
                autoPlay />}
      </header>
    </div>
  );
};

export default FullNativeVideoRecorder;