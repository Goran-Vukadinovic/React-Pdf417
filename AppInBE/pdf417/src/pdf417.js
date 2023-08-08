var fs = require('fs');
var PNG = require("pngjs").PNG;
var jpeg = require('jpeg-js')
const sharp = require('sharp')

const { MultiFormatReader, PDF417Reader, BarcodeFormat, DecodeHintType, RGBLuminanceSource, BinaryBitmap, HybridBinarizer } = require('@zxing/library');
const { findSourceMap } = require('module');


var strPath = "./test/test.png"
const sharpenImage = () => {
  sharp (strPath)
  .sharpen(13)
  .toFile('./test/sharpen_robo.jpg')
}

//sharpenImage()
//scanPNG('./test/3-1.png');

preProcess(strPath);
function preProcess(strPath)
{
  const imgData = fs.readFileSync(strPath);
  var rawData = PNG.sync.read(imgData);
  var rawImageData = rawData.data;
  const len = rawData.width * rawData.height;
  for(let i = 0; i < len; i++){
    var val = ((rawImageData[i*4] * 306 +rawImageData[i*4+1] * 601 + rawImageData[i*4+2] * 117) >> 10) & 0xFF;
    if(val > 100)
    {
      rawImageData[i * 4] = 255;
      rawImageData[i * 4 + 1] = 255;
      rawImageData[i * 4 + 2] = 255
      rawImageData[i * 4 + 3] = 255;
    }
    else
    {
      
    }
  }
  var buffer = PNG.sync.write(rawData);
  fs.writeFileSync('./test/out.png', buffer);
}
function scanPNG(strPath)
{
  if(strPath)
  {
    const imgData = fs.readFileSync(strPath);
    var rawData = null;
    var ext = strPath.substring(strPath.length - 3);
    ext = ext.toLowerCase();
    
    if(ext == "jpg") rawData = jpeg.decode(imgData);
    else if(ext == "png")
    {
      rawData = PNG.sync.read(imgData);
    }
    
    var imgWidth = rawData.width;
    var imgHeight = rawData.height;
    var rawImageData = rawData.data;
    
    var result = scanPDF417(rawImageData, imgWidth, imgHeight);
    console.log(result);
  }
}

function scanPDF417(rawImageData, imgWidth, imgHeight)
{
  console.log(imgWidth, imgHeight);
  const hints = new Map();
  const formats = [BarcodeFormat.PDF_417];
  hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
  hints.set(DecodeHintType.TRY_HARDER, true);
  hints.set(DecodeHintType.CHARACTER_SET, "utf-8");
  const reader = new PDF417Reader();
  //const reader = new MultiFormatReader();
  
  const len = imgWidth * imgHeight;
  const luminancesUint8Array = new Uint8ClampedArray(len);
  for(let i = 0; i < len; i++){
    var val = ((rawImageData[i*4] * 306 +rawImageData[i*4+1] * 601 + rawImageData[i*4+2] * 117) >> 10) & 0xFF;
    luminancesUint8Array[i] = val;
    if(val < 128)
    {
      luminancesUint8Array[i] = 0;
    } 
  }
  const luminanceSource = new RGBLuminanceSource(luminancesUint8Array, imgWidth, imgHeight);
  const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));
  try {
    var result = reader.decode(binaryBitmap, hints);
    return result;
  } catch (e) {    
    console.log(e);
  }
  return null;
}

function scanBase64Jpg(base64)
{
  const buff = Buffer.from(base64.substr(23), 'base64');
  const rawImageData = jpeg.decode(buff);
  return scanPDF417(rawImageData.data, rawImageData.width, rawImageData.height);
}

function scanBase64PNG(base64)
{
  const buff = Buffer.from(base64.substr(23), 'base64');
  console.log(buff.length, buff);
  const rawImageData = PNG.sync.read(buff);
  console.log(rawImageData);
  return scanPDF417(rawImageData.data, rawImageData.width, rawImageData.height);
}

module.exports = {
  scanBase64Jpg:scanBase64Jpg,
  scanPDF417:scanPDF417,
}