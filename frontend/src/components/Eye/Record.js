import { ReactMediaRecorder } from "react-media-recorder-cr";
 
const RecordView = () => {
  
  const startHandler = () => {
    document.getElementById("stopid").style.display = 'block';
    document.getElementById("startid").style.display = 'none';
  }

  const stopHandler = () => {
    document.getElementById("stopid").style.display = 'none';
    document.getElementById("startid").style.display = 'block';
    document.getElementById("videoid").style.display = 'block';
  }

  return (
    <div style={{textAlign: 'center'}}>
    <ReactMediaRecorder
      video
      render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
        <div>
          <p>{status}</p>
          <button id="startid" style={{display:'block'}} onClick={() => {startRecording(); startHandler();}}>Start Recording</button>
          <button id="stopid" style={{display:'none'}} onClick={() => {stopRecording(); stopHandler();}}>Stop Recording</button>
          <video id="videoid" src={mediaBlobUrl} style={{display:'none'}} controls autoplay loop />
        </div>
      )}
    />
  </div>
  )
}
  


export default RecordView;