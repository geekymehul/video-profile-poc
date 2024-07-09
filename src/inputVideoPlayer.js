import React, { useEffect, useRef, useState } from "react";

const InputVideoPlayer =(props)=> {

    const inputRef = useRef(null);
    const videoRef = useRef(null);

    const [videoSrc , seVideoSrc] = useState("");

    const getDuration =(e) => {
      e.target.currentTime = 0;
      var duration = e.target.duration;
      e.target.removeEventListener('timeupdate', getDuration)
      console.log("duration is "+ duration);
    }

    const handleChange = (e) => {
      const file = e.target.files[0];
      if(!file)
        return;

      const video = document.createElement('video');
      video.preload = 'metadata';
    
      video.onloadedmetadata = function() {
        window.URL.revokeObjectURL(video.src);
        if (video.duration === Infinity) {
          // fix for bug when duration is wrongly returned
          video.currentTime = 1e101;
          video.addEventListener('timeupdate', getDuration)
        } else {
          var duration = video.duration;
          console.log("duration is "+ duration);
        }
      }
    
      const videoUrl = URL.createObjectURL(file);

      video.src = videoUrl;

      seVideoSrc(videoUrl);
      setTimeout(()=>{
        videoRef.current.play();
      },0);
  };

    return <div>
        <input id="file" type="file" accept="video/mp4,video/mkv, vide0/webm, video/x-m4v,video/*" ref={inputRef} onChange={handleChange}/>
        <video id="video" ref={videoRef} src={videoSrc}></video>
    </div>

};

export default InputVideoPlayer;