import React, { useEffect, useRef, useState } from "react";

const InputVideoPlayer =(props)=> {

    const inputRef = useRef(null);
    const videoRef = useRef(null);

    const [videoSrc , seVideoSrc] = useState("");

    const handleChange = (e) => {
      const file = e.target.files[0];
      if(!file)
        return;
      const videourl = URL.createObjectURL(file);
      seVideoSrc(videourl);
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