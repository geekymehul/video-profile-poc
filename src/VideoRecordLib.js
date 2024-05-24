import React, { useState, useRef, useEffect } from "react";
import 'video.js/dist/video-js.min.css';
import videojs from 'video.js';
import RecordRTC from 'recordrtc';
import 'videojs-record/dist/css/videojs.record.css';
import Record from 'videojs-record/dist/videojs.record.js';

const NativeVideoRecorder =(props) => {
  
    const [isVideo,setIsVideo] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const videoMimeType = useRef(null);

    useEffect(()=>{

        if (MediaRecorder.isTypeSupported('video/webm; codecs=vp9')) {
            videoMimeType.current = 'video/webm; codecs=vp9';
        } else if (MediaRecorder.isTypeSupported('video/mp4')) {
            videoMimeType.current = 'video/mp4';
        }

        const options = {
            controls: true,
            bigPlayButton: false,
            width: 320,
            height: 240,
            fluid: false,
            // videoMimeType: videoMimeType.current,
            plugins: {
                record: {
                    audio: true,
                    video: true,
                }
            }
        };
        
        const player = videojs('myVideo', options, function() {
            // print version information at startup
            const msg = 'Using video.js ' + videojs.VERSION +
                ' with videojs-record ' + videojs.getPluginVersion('record') +
                ' and recordrtc ' + RecordRTC.version;
            videojs.log(msg);
        });
        
        // error handling
        player.on('deviceError', function() {
            console.log('device error:', player.deviceErrorCode);
        });
        
        player.on('error', function(element, error) {
            console.error(error);
        });
        
        // user clicked the record button and started recording
        player.on('startRecord', function() {
            console.log('started recording!');
        });
        
        // user completed recording and stream is available
        player.on('finishRecord', function() {
            // the blob object contains the recorded data that
            // can be downloaded by the user, stored on server etc.
            console.log('finished recording: ', player.recordedData);
            player.record().saveAs({'video': 'my-video-file-name.webm'});
            setIsVideo(player.recordedData);
            //creates a blob file from the videochunks data
            const videoBlob = new Blob(player.recordedData);
            //creates a playable URL from the blob file.
            const videoDownUrl = URL.createObjectURL(videoBlob);
            setVideoUrl(videoDownUrl);
            player.record().destroy();
        });
    },[])

    return <>
        <div>Video-Record Library</div>
        <video id="myVideo" playsinline className="video-js vjs-default-skin"></video>
        {/* {videoUrl ? <video
            src={videoUrl}
            controls
            autoPlay
            style={{ width: "350px" }}
          /> : <video id="myVideo" playsinline className="video-js vjs-default-skin"></video>} */}
    </>
};

export default NativeVideoRecorder;