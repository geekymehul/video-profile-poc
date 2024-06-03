import './App.css';
import AudioRecorder from "./audioRecorder";
import NativeVideoRecorder from "./nativeVideoRecorder";
import VideoRecorder from "./videoRecorder";
import { useState } from 'react';

function App() {

  const [isActive,setActive] = useState(false);
  const [isFullScreen, setFullScreen] = useState(false);

  return (
    <div className="App">
      {isFullScreen ? <></> : <>
        <AudioRecorder></AudioRecorder>
        <br></br>
        <br></br>
        <NativeVideoRecorder enableCompression={true} setActive={setActive}/>
        <br></br>
        <br></br>
        <VideoRecorder setActive={setActive}></VideoRecorder>
        <br></br>
      </>}
      <NativeVideoRecorder enableCompression={true} setFullScreen={setFullScreen} isActive={isActive}/>
      {/* <FullNativeVideoRecorder isActive={isActive} setFullScreen={setFullScreen}></FullNativeVideoRecorder> */}
    </div>
  );
}

export default App;
