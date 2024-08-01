import React, { useState, useRef, useEffect } from "react";
import RecordRTC, { invokeSaveAsDialog } from "recordrtc";

let mimeType = 'video/webm;codecs=vp9';

const VideoRecorder =(props) => {
  const [stream, setStream] = useState(null);
  const [blob, setBlob] = useState(null);
  const refVideo = useRef(null);
  const refRecordingElem = useRef(null);
  const recorderRef = useRef(null);
  const videoChunks = useRef([]);
  const[isPlaying, setIsPlaying] = useState(false);
  const currentTime = useRef(0);

  const isIOS =()=>  /iPhone|iPad|iPod/i.test(navigator.userAgent);

  const isSafari =()=> /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent);

  const handleRecording = async () => {
    if(props.setActive) {
      props.setActive(true);
    }
    setBlob(null);
    let options;

    let localAudioChunks = [];

    if(isIOS() || isSafari()) {
      alert("mp4 format is being used");
      mimeType = 'video/mp4';
      options = {
        mimeType: 'video/mp4',
        videoBitsPerSecond : 2000000
      }
    } else {
      mimeType = 'video/webm';
      options = { 
        mimeType: 'video/webm; codecs=vp9',
        videoBitsPerSecond : 2000000,
        timeSlice: 1000,
        ondataavailable: data => {
          if (typeof data === "undefined") return;
          if (data.size === 0) return;
          localAudioChunks.push(data);
        }
      } ;
    }
    videoChunks.current = localAudioChunks;

    const mediaStream = (await navigator.mediaDevices.getUserMedia({ video: true, audio: {echoCancellation: true,
      noiseSuppression: true} }));
    setStream(mediaStream);
    recorderRef.current = new RecordRTC(stream, {
      type: 'video',
      disableLogs: true,
      mimeType: 'video/mp4',
      recorderType: RecordRTC.MediaStreamRecorder,
    });
    recorderRef.current.camera = mediaStream;
    if(recorderRef.current)
        recorderRef.current.startRecording();
  };

  const handleStop = () => {
    if(props.setActive) {
      props.setActive(false);
    }
    recorderRef.current.stopRecording( () => {
      const videoBlob = recorderRef.current.getBlob();
      setBlob(videoBlob);
      getFileDuration(URL.createObjectURL(videoBlob)).then(duration => {
        alert("Video length is "+duration);
      }).catch(err => {
        alert("error occurred "+err);
      });
      recorderRef.current.camera.stop();
      recorderRef.current.destroy();
      recorderRef.current = null;
    });
  };

  const handleSave = () => {
    invokeSaveAsDialog(blob);
  };

  const playStopVideo =() => {
    // state update causes video to go to intial time
    // store current time once user has left
    if(isPlaying) {
      currentTime.current = refVideo.current.currentTime;
    }
    setIsPlaying(isPlaying => !isPlaying);
  };

  const onVideoEnd =() => {
    // video playback has ended
    // reset all the state
    currentTime.current = 0;
    setIsPlaying(false);
  };

  const getFileDuration =(fileSrc) => new Promise(resolve => {
    const filePlayer = document.createElement("video");
    filePlayer.preload = "metadata";
    filePlayer.autoplay = true;
  
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

  useEffect(() => {
    if(refRecordingElem.current) {
        refRecordingElem.current.srcObject = stream;
    }
    // refVideo.current.srcObject = stream;
  }, [stream, refVideo]);


  useEffect(() => {
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

  return (
    <div className="video">
      <div>WebRTC Video Recording</div>
      <div className="video-header">
        <button onClick={handleRecording}>start</button>
        <button onClick={handleStop}>stop</button>
        <button onClick={handleSave}>save</button>
        {blob ? <>
          <video
            src={URL.createObjectURL(blob)}
            controls
            ref={refVideo}
            style={{ width: "350px" }}
            playsInline
          />
          <a download href={URL.createObjectURL(blob)}>Download Recording</a>
          <button onClick={playStopVideo}>Play Pause</button>
        </> : <video ref={refRecordingElem}
                style={{ width: "350px" }}
                controls
                playsInline
                autoPlay>
                </video>}
      </div>
    </div>
  );
};

export default VideoRecorder;