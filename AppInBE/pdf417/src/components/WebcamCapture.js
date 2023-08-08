import React, { useState } from 'react'
import Webcam from "react-webcam";
import axios from 'axios';

const WebcamComponent = () => <Webcam />;

const videoConstraints = {
  facingMode: "environment"//"user"
};
const WebcamCapture = () => {
  const [picture, setPicture] = useState('')
  const [result, setResult] = useState("");
  const webcamRef = React.useRef(null)

  const capture = React.useCallback(() => {
    //const pictureSrc = webcamRef.current.getScreenshot({width:1024, height:768})
    const pictureSrc = webcamRef.current.getScreenshot()
    console.log(pictureSrc);
    setResult('Scanning...');
    axios.post("/scan_id", {front:pictureSrc, back:''})
    .then((res)=>{
      var data = res.data;
      var front = data.front;
      if(front) setResult(front.text);
      else setResult('')
    });
    setPicture(pictureSrc)
  })

  return (
    <div>
      <h2 className="mb-5 text-center">
        React PDF417 Scanner on the BackEnd
      </h2>
      <h5>
        When press the Capture button, the following action is performed.<br/>
        1. capture camera image in jpg format<br/>
        2. send it to the server<br/>
        3. scan image to decode pdf417.<br/>
        4. response result to client.<br/>
        5. display result. If then scanning is failed(can not detect pdf417 code), result is not displayed.<br/>
        To try again, please presss the Retake button
      </h5>
      <div>
        {picture == '' ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
        ) : (
          <img src={picture} />
        )}
      </div>
      <div>
        {picture != '' ? (
          <button
            onClick={(e) => {
              e.preventDefault()
              setPicture('')
              setResult('')
            }}
            className="btn btn-primary"
          >
            Retake
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault()
              capture()
            }}
            className="btn btn-danger"
          >
            Capture
          </button>
        )}
      </div>
      <div>
        <span>
        Result : {result}
        </span>
      </div>
    </div>
  )
}
export default WebcamCapture