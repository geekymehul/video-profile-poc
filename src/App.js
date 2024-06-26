import './App.css';
import AudioRecorder from "./audioRecorder";
import InputVideoPlayer from './inputVideoPlayer';
import NativeVideoRecorder from "./nativeVideoRecorder";
import TrueCallerSdk from './truecallerSdk';
import VideoRecorder from "./videoRecorder";
import { useState } from 'react';

function App() {

  const [isActive,setActive] = useState(false);
  const [isFullScreen, setFullScreen] = useState(false);

  return (
    <div className="App">
      <TrueCallerSdk/>
      {isFullScreen ? <></> : <>
        <AudioRecorder></AudioRecorder>
        {/* <br></br>
        <br></br>
        <NativeVideoRecorder enableCompression={true} setActive={setActive}/> */}
        <br></br>
        <br></br>
        <VideoRecorder setActive={setActive}></VideoRecorder>
        <br></br>
        <br></br>
        <InputVideoPlayer></InputVideoPlayer>
        <br></br>
      </>}
      <NativeVideoRecorder enableCompression={true} setFullScreen={setFullScreen} isActive={isActive}/>
      {/* <FullNativeVideoRecorder isActive={isActive} setFullScreen={setFullScreen}></FullNativeVideoRecorder> */}
    </div>
  );
}

export default App;
