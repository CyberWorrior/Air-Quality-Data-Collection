
const express = require('express')
const bodyParser = require('body-parser');
const url = require('url');
const querystring = require('querystring');
const admin = require('firebase-admin');
// var http = require('http');


const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// const server = http.createServer(app);

// const Websocket = require('ws')
// const s = new Websocket.Server({
//     server
// })
const port =process.env.PORT || 443
const serviceAccount = require('./arduino-pollution-firebase-adminsdk-lwudr-cbe5d7dd5b.json');

admin.initializeApp({
    credential:admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const msg = "Success";
const err = "No Value Receviced"

app.get('/soundstate',async function(req,res){
    let sensor = req.query.sensor
    let soundState = req.query.soundstate
    let timestamp = req.query.timestamp
    let stringTime = req.query.stringtime
    
    if(sensor || soundState || timestamp){
        res.status(200).send(msg)
        var soundData = {
            sensor: sensor,
            soundState: soundState,
            timestamp: timestamp,
            stringtime:stringTime
        }
        const docRef = db.collection('soundData')
        await docRef.add(soundData)
        console.log(soundData)
    }else{
        res.status(-1).send(err)
    }
})

app.get('/airquality',async function(req,res){
    let sensor = req.query.sensor
    let airQuality = req.query.airquality
    let timestamp = req.query.timestamp
    let stringTime = req.query.stringtime
    if(sensor || airQuality || timestamp){
        res.status(200).send(msg)
        var airData = {
            sensor: sensor,
            airquality: airQuality,
            timestamp: timestamp,
            stringtime:stringTime
        }
        const docRef = db.collection('airData')
        await docRef.add(airData)
        console.log(airData)
    }else{
        res.status(-1).send(err)
    }
})

app.get('/', async function(req, res) {
  let msgMain = "Main page of aqi-server use child nodes for get requests";
  res.status(200).send(msgMain)
})


// s.on('connection',function(ws,req){
//     ws.on('message',function(message){
//         console.log("Recevied : "+message)
//         s.clients.forEach(function(client){
//             if(client!=ws && client.readyState){
//                 client.send("broadcast "+ message);
//             }
//         })
//     })

//     ws.on('close',function(){
//         console.log("lost one client");
//     });

//     console.log("new client conneected");
// })

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})
// server.listen(port);