import './App.css';
import AudioRecorder from "./audioRecorder";
import NativeVideoRecorder from "./nativeVideoRecorder";
import FullNativeVideoRecorder from './fullNativeRecorder';
import VideoRecorder from "./videoRecorder";
import VideoRecordLib from "./VideoRecordLib";

function App() {
  return (
    <div className="App">
      <AudioRecorder></AudioRecorder>
      <br></br>
      <br></br>
      <NativeVideoRecorder/>
      <br></br>
      <br></br>
      <NativeVideoRecorder enableCompression={true}/>
      <FullNativeVideoRecorder></FullNativeVideoRecorder>
    </div>
  );
}

export default App;
