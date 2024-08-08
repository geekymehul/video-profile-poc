import './App.css';
import AudioRecorder from "./audioRecorder";
import InputVideoPlayer from './inputVideoPlayer';
import NativeVideoRecorder from "./nativeVideoRecorder";
import TrueCallerSdk from './truecallerSdk';
import VideoRecorder from "./videoRecorder";
import WebcamStreamCapture from "./wbcamLib";
import { useState } from 'react';
import FileCompressor from './fileCompressor';
import InputAudioPlayer from './inputAudioPlayer';

function App() {

  const [isActive,setActive] = useState(false);
  const [isFullScreen, setFullScreen] = useState(false);

  return (
    <div className="App">
      {/* <TrueCallerSdk/> */}
      {isFullScreen ? <></> : <>
        {/* <AudioRecorder></AudioRecorder> */}
        <br></br>
        <br></br>
        <NativeVideoRecorder enableCompression={true} setActive={setActive}/>
        <br></br>
        <br></br>
        {/* <VideoRecorder setActive={setActive}></VideoRecorder> */}
        <br></br>
        <br></br>
        {/* <InputAudioPlayer/> */}
        {/* <InputVideoPlayer></InputVideoPlayer> */}
        {/* <FileCompressor></FileCompressor> */}
        <br></br>
      </>}
{/* 
      <WebcamStreamCapture/> */}
          
      {/* <NativeVideoRecorder enableCompression={true} setFullScreen={setFullScreen} isActive={isActive}/> */}
      {/* <FullNativeVideoRecorder isActive={isActive} setFullScreen={setFullScreen}></FullNativeVideoRecorder> */}
    </div>
  );
}

export default App;
