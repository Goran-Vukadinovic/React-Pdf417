import {Buffer} from 'buffer';
import React, { useState } from 'react'
import Webcam from 'react-webcam'
import { PDF417Reader, BarcodeFormat, DecodeHintType, RGBLuminanceSource, BinaryBitmap, HybridBinarizer } from '@zxing/library';
import jpeg from "jpeg-js";

global.Buffer = Buffer;


const WebcamComponent = () => <Webcam />

const videoConstraints = {
  facingMode: 'environment'//'user',
}

function scanPDF417(base64)
{
  const buff = Buffer.from(base64.substr(23), 'base64');
  const dimensions = buff.length;
  const rawImageData = jpeg.decode(buff);
  const hints = new Map();
  const CHARSET = 'utf-8';
  const formats = [BarcodeFormat.PDF_417];
  hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
  //hints.set(DecodeHintType.CHARACTER_SET, CHARSET);
  //hints.set(DecodeHintType.TRY_HARDER, true);
  //hints.set(DecodeHintType.PURE_BARCODE, true);
  const reader = new PDF417Reader();
  const len = rawImageData.width * rawImageData.height;  
  const luminancesUint8Array = new Uint8ClampedArray(len);  
  for(let i = 0; i < len; i++){
    //luminancesUint8Array[i] = ((rawImageData.data[i*4] + rawImageData.data[i*4+1] * 2 + rawImageData.data[i*4+2]) / 4) & 0xFF;
    luminancesUint8Array[i] = ((rawImageData.data[i*4] * 2 + rawImageData.data[i*4+1] * 7 + rawImageData.data[i*4+2]) / 10) & 0xFF;
  }
  const luminanceSource = new RGBLuminanceSource(luminancesUint8Array, rawImageData.width, rawImageData.height);
  //console.log(luminanceSource)
  const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));
  try{
    const result = reader.decode(binaryBitmap, hints);
    console.log(result);
    return result;
  }
  catch(e)
  {
    ///console.log(e);
  }
  return '';
}

const Profile = () => {
  const [picture, setPicture] = useState('')
  const webcamRef = React.useRef(null)

  const capture = React.useCallback(() => {
    const pictureSrc = webcamRef.current.getScreenshot()
    var result = scanPDF417(pictureSrc);
    if(result)
    {
      setPicture(pictureSrc)
    }    
  })
  return (
    <div>
      <h2 className="mb-5 text-center">
        React Photo Capture using Web camera
      </h2>
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
    </div>
  )
}
export default Profile