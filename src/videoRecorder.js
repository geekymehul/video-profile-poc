import React, { useState, useRef, useEffect } from "react";
import RecordRTC, { invokeSaveAsDialog } from "recordrtc";

const VideoRecorder =(props) => {
  const [stream, setStream] = useState(null);
  const [blob, setBlob] = useState(null);
  const refVideo = useRef(null);
  const refRecordingElem = useRef(null);
  const recorderRef = useRef(null);

  const handleRecording = async () => {
    setBlob(null);
    const mediaStream = (await navigator.mediaDevices.getUserMedia({ video: true, audio: true }));
    setStream(mediaStream);
    recorderRef.current = new RecordRTC(mediaStream, { type: "video" });
    recorderRef.current.camera = mediaStream;
    if(recorderRef.current)
        recorderRef.current.startRecording();
  };

  const handleStop = () => {
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
      <div>Library Video Recording</div>
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