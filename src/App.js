import './App.css';
import AudioRecorder from "./audioRecorder";
import NativeVideoRecorder from "./nativeVideoRecorder";
import VideoRecorder from "./videoRecorder";

function App() {
  return (
    <div className="App">
      <AudioRecorder></AudioRecorder>
      <VideoRecorder></VideoRecorder>
      <NativeVideoRecorder></NativeVideoRecorder>
    </div>
  );
}

export default App;
