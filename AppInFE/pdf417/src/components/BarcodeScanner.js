import { useState } from "react";
import { useZxing } from "react-zxing";
//import { useMediaDevices } from "react-media-devices";
//import MediaDevices from 'media-devices'
//var mediaList = await MediaDevices.enumerateDevices();
//var devices = await MediaDevices.getUserMedia({ video: true, audio: false })

const BarcodeScanner = () => {
  const [result, setResult] = useState("");
  const { ref } = useZxing({
    onResult(result) {
      setResult(result.getText());
    },
  });

  return (
    <>
      <video ref={ref} />
      <p>
        <span>Result:</span>
        <span>{result}</span>
      </p>
    </>
  );
};

export default BarcodeScanner