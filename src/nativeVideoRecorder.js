import React, { useState, useRef } from "react";
import Timer from "./timeCounter";

// let mimeType = 'video/webm;codecs=h264';
// let mimeType = "video/x-matroska;codecs=avc1";
let mimeType = 'video/webm;codecs=vp9';

export const isIOS16OrLower =() => {
  const userAgent = navigator.userAgent;
  const iosRegex = /iPhone|iPad|iPod/i;
  const versionRegex = /OS (\d+)_(\d+)/;

  // Check if the user agent indicates iOS
  if (iosRegex.test(userAgent)) {
      const match = userAgent.match(versionRegex);
      if (match) {
          // Extract the major and minor version numbers
          const majorVersion = parseInt(match[1], 10);

          // Check if the version is 16 or lower
          if (majorVersion <= 16) {
              return true;
          }
      }
  }
  // user is not iOS
  return false;
};


const NativeVideoRecorder =(props) => {
  const [stream, setStream] = useState(null);
  const [blob, setBlob] = useState(null);
  const [videoUrl,setVideoUrl] = useState(null);

  const refVideo = useRef(null);
  const refRecordingElem = useRef(null);
  const recorderRef = useRef(null);
  const videoChunks = useRef([]);
  const recorderVideoChunks = useRef([]);
  const currentTime = useRef(0);
  const isOldIos = useRef(isIOS16OrLower());
  const [isRecording, setIsRecording] = useState(false);

  const[isPlaying, setIsPlaying] = useState(false);

  const handleRecording = async () => {
    if(props.setActive) {
      props.setActive(true);
    }
    if(props.setFullScreen) {
      props.setFullScreen(true)
    }
    setBlob(null);
    setVideoUrl(null);
    let options;

    // try {
    //   if (MediaRecorder.isTypeSupported('video/webm; codecs=vp9')) {
    //     mimeType = 'video/webm; codecs=vp9';
    //     options = {mimeType: 'video/webm; codecs=vp9', videoBitsPerSecond : 2000000};
    //   } else if (MediaRecorder.isTypeSupported('video/mp4')) {
    //     mimeType = 'video/mp4';
    //     options = {mimeType: 'video/mp4', videoBitsPerSecond : 2000000};
    //   } else {
    //     alert("Recording Media is not supported in your device!")
    //   }

    //   if(!MediaRecorder) {
    //     alert("media recorder is not supported");
    //   }

    try {

      options = {
        mimeType: 'video/mp4',
        videoBitsPerSecond : 1000000,
        width: 640,
        height: 480
      };

      navigator.mediaDevices.getUserMedia({ video: true, audio: {echoCancellation: true,
        noiseSuppression: true} }).then(mediaStream => {
          setIsRecording(true);
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
    if(props.setActive) {
      props.setActive(false);
    }
    if(recorderRef.current) {
        //stops the recording instance
        recorderRef.current.stop();
        recorderRef.current.onstop = () => {
            //creates a blob file from the videochunks data
            setIsRecording(false);
            const videoBlob = new Blob(videoChunks.current, { type: mimeType });
            //creates a playable URL from the blob file.
            const videoDownUrl = URL.createObjectURL(videoBlob);
            setVideoUrl(videoDownUrl);
            recorderVideoChunks.current = videoChunks.current;
            videoChunks.current = [];

            if(stream) {
              stream.getTracks().forEach(function(track) {
                track.stop();
              });
            }

            getFileDuration(URL.createObjectURL(videoBlob)).then(duration => {
            }).catch(err => {
              alert("error occurred "+err);
            });

            if(props.setFullScreen) {
              props.setFullScreen(false);
            }
        };
    }
  };

  const playStopVideo =() => {
    // state update causes video to go to intial time
    // store current time once user has left
    if(isPlaying) {
      currentTime.current = refVideo.current.currentTime;
    }
    setIsPlaying(isPlaying => !isPlaying);
  };

  const getFileDuration =(fileSrc) => new Promise(resolve => {
    const filePlayer = document.createElement("video");
    filePlayer.preload = "metadata";
    filePlayer.muted = true;
    filePlayer.autoplay = true;
    filePlayer.playsInline = true;
  
    const getDuration = e => {
      e.target.currentTime = 0;
      const duration = e.target.duration;
      e.target.removeEventListener("timeupdate", getDuration);
      resolve(duration);
    };
  
    filePlayer.onloadedmetadata = function() {
      if (filePlayer.duration === Infinity) {
        // fix for bug when duration is wrongly returned
        filePlayer.currentTime = 1e101;
        filePlayer.addEventListener("timeupdate", getDuration);
      } else {
        const duration = filePlayer.duration;
        filePlayer.remove();
        resolve(duration);
      }
    };
  
    filePlayer.src = fileSrc;
  });

  const playbackLoaded =() => {
    if(refVideo.current) {
      alert("playback loaded");
    }
  }

  React.useEffect(() => {
    if(!refVideo.current)
      return;
    // on state render video gets set to intial time
    // in order to resume video from when user paused
    // seek the video to current time
    refVideo.current.currentTime = currentTime.current;
    if(isPlaying) {
      refVideo.current.play();
    } else {
      refVideo.current.pause();
    }
  }, [isPlaying]);

  const width = props.setFullScreen ? window.innerWidth : "350px";
  const height = props.setFullScreen ? window.innerHeight : "";

  return (
    <div className="video">
      <div>{(props.setFullScreen ? "Full screen " : "") + (props.enableCompression ? "Compressed " : "") + ("Video Recording")}</div>
      <header className="video-header">
      {props.setFullScreen ? !props.isActive ? <>
            <button onClick={handleRecording} className="btn-start">start</button>
            <button onClick={handleStop} className="btn-stop">stop</button>
        </> : <></> : <>
          <button onClick={handleRecording}>start</button>
          <button onClick={handleStop}>stop</button>
        </>}
        {videoUrl ? <>
          <video
            src={videoUrl}
            playsInline={true}
            autoPlay={true}
            style={{ width: "350px", height: "350px"}}
            ref={refVideo}
            preload="metadata"
            onLoadedMetadata={playbackLoaded}
            key={"recorded"}
            controls={isOldIos.current}
            onError={err => {
              alert('Video load error. ' + err);
            }}
            >
          </video>
          <button onClick={playStopVideo}>Play Pause</button>
          <a download href={videoUrl}>Native Download Recording</a>
        </> : <video ref={refRecordingElem}
                style={{ width, height }}
                className="fullscreen-video"
                key={"recording"}
                playsInline
                muted
                autoPlay />}
      {isRecording ? <Timer/> : ""}
      </header>
    </div>
  );
};

export default NativeVideoRecorder;