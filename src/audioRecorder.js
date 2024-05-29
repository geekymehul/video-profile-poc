import React, { useState, useRef } from "react";

const mimeType = "audio/webm";

const AudioRecorder = (props) => {
    const mediaRecorder = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const audioChunks = useRef([]);
    const recorderAudioChunks = useRef([]);
    const [audio, setAudio] = useState(null);

    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) { 
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                startRecording(streamData);
            } catch (err) {
                console.warn(err.message);
            }
        } else {
            console.warn("The MediaRecorder API is not supported in your browser.");
        }
    };

    const startRecording = (stream) => {
        if(stream) {
            setRecordingStatus("recording");
            //create new Media recorder instance using the stream
            const media = new MediaRecorder(stream, { mimeType });
            //set the MediaRecorder instance to the mediaRecorder ref
            mediaRecorder.current = media;
            //invokes the start method to start the recording process
            mediaRecorder.current.start();
            let localAudioChunks = [];
            mediaRecorder.current.ondataavailable = event => {
                if (typeof event.data === "undefined") return;
                if (event.data.size === 0) return;
                localAudioChunks.push((event.data));
            };
            audioChunks.current = localAudioChunks;
        }
    };

      const stopRecording =()=> {
        setRecordingStatus("inactive");
        if(mediaRecorder.current) {
            //stops the recording instance
            mediaRecorder.current.stop();
            mediaRecorder.current.onstop = () => {
                //creates a blob file from the audiochunks data
                const audioBlob = new Blob(audioChunks.current, { type: mimeType });
                //creates a playable URL from the blob file.
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudio(audioUrl);
                recorderAudioChunks.current = audioChunks.current;
                audioChunks.current = [];
            };
        }
      };

      const getBase64 =()=> {
        // atob cannot be used as encoding is not per function implementation
        if(audio) {
            // firstly convert Media Recorder chunks to Blob
            const superBuffer = new Blob(recorderAudioChunks.current, {type: mimeType});
            // useFileReader to read blob file as dataUrl
            const reader = new window.FileReader();
            reader.readAsDataURL(superBuffer);
            // on completion of file read, loadend event is fired
            reader.onloadend = function() {
                try {
                    // result is in form of data url string
                    // the info is seperated by "," first item contains encoding info and the second base64 value
                    // reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs
                    let base64 = reader.result;
                    base64 = base64 ? base64.toString().split(",")[1] : "";
                    console.log(base64 );
                } catch(e) {
                    console.log("error occured when converting into base64");
                }
            };
        }
      };

    return <div className="audio-controls">
        {recordingStatus === "inactive" ? <button onClick={getMicrophonePermission} type="button">
            Start Audio Recording
        </button> : null}
        {recordingStatus === "recording" ? (
        <button onClick={stopRecording} type="button">
            Stop Audio Recording
        </button>
        ) : null}
        {audio ? <div className="audio-container">
            <audio src={audio} controls></audio>
            <div onClick={getBase64}>Convert To base64</div>
            <a download href={audio}>
                Download Recording
            </a>
        </div> : null}
    </div>;
};

export default AudioRecorder;
