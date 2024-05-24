import './App.css';
import AudioRecorder from "./audioRecorder";
import NativeVideoRecorder from "./nativeVideoRecorder";
import VideoRecorder from "./videoRecorder";
import VideoRecordLib from "./VideoRecordLib";

function App() {
  return (
    <div className="App">
      <AudioRecorder></AudioRecorder>
      <VideoRecorder></VideoRecorder>
      <NativeVideoRecorder></NativeVideoRecorder>
      <VideoRecordLib></VideoRecordLib>
    </div>
  );
}

export default App;
