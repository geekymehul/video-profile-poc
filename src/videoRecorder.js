import React, { useState, useRef, useEffect } from "react";
import RecordRTC, { invokeSaveAsDialog } from "recordrtc";

let mimeType = 'video/webm;codecs=vp9';

const VideoRecorder =(props) => {
  const [stream, setStream] = useState(null);
  const [blob, setBlob] = useState(null);
  const refVideo = useRef(null);
  const refRecordingElem = useRef(null);
  const recorderRef = useRef(null);

  const isIOS =()=>  /iPhone|iPad|iPod/i.test(navigator.userAgent);

  const isSafari =()=> /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent);

  const handleRecording = async () => {
    if(props.setActive) {
      props.setActive(true);
    }
    setBlob(null);
    let options;

    if(isIOS() || isSafari()) {
      mimeType = 'video/mp4';
      options = props.enableCompression ? {mimeType: 'video/mp4', videoBitsPerSecond : 2000000} : {mimeType: 'video/mp4'};
    } else {
      mimeType = 'video/webm; codecs=vp9';
      options = props.enableCompression ? {mimeType: 'video/webm; codecs=vp9', videoBitsPerSecond : 2000000} : {mimeType: 'video/webm; codecs=vp9'};
    }

    const mediaStream = (await navigator.mediaDevices.getUserMedia({ video: true, audio: {echoCancellation: true,
      noiseSuppression: true} }));
    setStream(mediaStream);
    recorderRef.current = new RecordRTC(mediaStream, options);
    recorderRef.current.camera = mediaStream;
    if(recorderRef.current)
        recorderRef.current.startRecording();
  };

  const handleStop = () => {
    if(props.setActive) {
      props.setActive(false);
    }
    recorderRef.current.stopRecording(() => {
      setBlob(recorderRef.current.getBlob());
      recorderRef.current.camera.stop();
      recorderRef.current.destroy();
      recorderRef.current = null;
    });
  };

  const handleSave = () => {
    invokeSaveAsDialog(blob);
  };

  useEffect(() => {
    if(refRecordingElem.current) {
        refRecordingElem.current.srcObject = stream;
    }
    // refVideo.current.srcObject = stream;
  }, [stream, refVideo]);

  return (
    <div className="video">
      <div>WebRTC Video Recording</div>
      <header className="video-header">
        <button onClick={handleRecording}>start</button>
        <button onClick={handleStop}>stop</button>
        <button onClick={handleSave}>save</button>
        {blob ? <>
          <video
            src={URL.createObjectURL(blob)}
            controls
            autoPlay
            ref={refVideo}
            style={{ width: "350px" }}
          />
          <a download href={URL.createObjectURL(blob)}>Download Recording</a>
        </> : <video ref={refRecordingElem}
                style={{ width: "350px" }}
                controls
                autoPlay />}
      </header>
    </div>
  );
};

export default VideoRecorder;