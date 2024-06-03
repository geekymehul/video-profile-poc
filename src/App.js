import './App.css';
import AudioRecorder from "./audioRecorder";
import NativeVideoRecorder from "./nativeVideoRecorder";
import FullNativeVideoRecorder from './fullNativeRecorder';
import VideoRecorder from "./videoRecorder";
import VideoRecordLib from "./VideoRecordLib";
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
        <NativeVideoRecorder setActive={setActive}/>
        <br></br>
        <br></br>
        <NativeVideoRecorder enableCompression={true} setActive={setActive}/>
      </>}
      <NativeVideoRecorder enableCompression={true} setFullScreen={setFullScreen} isActive={isActive}/>
      {/* <FullNativeVideoRecorder isActive={isActive} setFullScreen={setFullScreen}></FullNativeVideoRecorder> */}
    </div>
  );
}

export default App;
