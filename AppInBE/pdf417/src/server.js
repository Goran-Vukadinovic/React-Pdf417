var fs = require('fs');
const path = require('path');
const express = require('express'); 
const app = express(); 
const pdf417 = require('./pdf417');
const port = process.env.PORT || 8443; 
var https = require('https');
var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

app.use(express.static(path.join(__dirname, '../build')));
app.use(express.json({limit:'16mb'}));

/*
app.get('/', (req, res) => {
  res.send("OK");
});
*/
app.post('/scan_id', (req, res) => {
  var front = req.body['front'];
  var back = req.body['back'];
  var frontResult = null;  
  var backResult = null;  
  if(front){
    frontResult = pdf417.scanBase64Jpg(front);
  }
  if(back){
    backResult = pdf417.scanBase64Jpg(back);
  }
  res.send({front:frontResult, back:backResult});
});

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(port, () => console.log(`Listening on port ${port}`));