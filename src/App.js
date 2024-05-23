import './App.css';
import AudioRecorder from "./audioRecorder";
import NativeVideoRecorder from "./nativeVideoRecorder";
import VideoRecorder from "./videoRecorder";
import ACVideoRecorder from "./AVNativeVideo";

function App() {
  return (
    <div className="App">
      <AudioRecorder></AudioRecorder>
      <VideoRecorder></VideoRecorder>
      <NativeVideoRecorder></NativeVideoRecorder>
      <ACVideoRecorder></ACVideoRecorder>
    </div>
  );
}

export default App;
