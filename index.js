const express = require('express')
const app = express()
var cors = require('cors')
const server_port = 8000
let state='conn'
const Firmata = require("firmata");const SerialPort = require('serialport')
const port = new SerialPort('COM9', {
  baudRate: 9600
})
// const port = new SerialPort('COM5', {
//     baudRate: 57600
// })
const board = new Firmata(port);
board.on("ready", function(){
    state='ready'
});

app.use(cors())
app.get('/', (req, res) => {
  res.send(state)
})


app.get('/pins', (req, res) => {
    res.json(board.pins)
})

app.get('/set/:pin/in', (req, res) => {
    const pin = parseInt(req.params.pin)
    if(state=='ready'){
        board.pinMode(pin,board.MODES.INPUT)
        res.json({
            err:false,
            msg:'ok'
        })
    }else{
        res.json({
            err:true,
            msg:'not ready'
        })
    }
})

app.get('/set/:pin/out', (req, res) => {
    const pin = parseInt(req.params.pin)
    if(state=='ready'){
        board.pinMode(pin,board.MODES.OUTPUT)
        res.json({
            err:false,
            msg:'ok'
        })
    }else{
        res.json({
            err:true,
            msg:'not ready'
        })
    }
})


app.get('/digital/:pin/:value', (req, res) => {
    const pin = parseInt(req.params.pin)
    const val = parseInt(req.params.value)
    if(state=='ready'){
        board.digitalWrite(pin,val)
        res.json({
            err:false,
            msg:{
                pin:pin,
                val:val
            }
        })
    }else{
        res.json({
            err:true,
            msg:'not ready'
        })
    }
})

//same the pwm
app.get('/analog/:pin/:value', (req, res) => {
    const pin = parseInt(req.params.pin)
    let val = parseInt(req.params.value)
    board.pinMode(pin,board.MODES.PWM)
    if(val>255){
        val=255
    }
    if(val<0){
        val=0
    }

    if(state=='ready'){
        board.analogWrite(pin,val)
        res.json({
            err:false,
            msg:{
                pin:pin,
                val:val
            }
        })
    }else{
        res.json({
            err:true,
            msg:'not ready'
        })
    }
})


app.get('/servo/:pin/:degree', (req, res) => {
    const pin = parseInt(req.params.pin)
    let degree = parseInt(req.params.degree)
    board.pinMode(pin,board.MODES.SERVO)
    
    if(state=='ready'){
        board.servoWrite(pin,degree)
        res.json({
            err:false,
            msg:{
                pin:pin,
                degree:degree
            }
        })
    }else{
        res.json({
            err:true,
            msg:'not ready'
        })
    }
})

app.get('/:pin', (req, res) => {
    const pin = parseInt(req.params.pin)
    board.pinMode(pin,board.MODES.INPUT)
    if(state=='ready'){
        board.digitalRead(pin,function(val){
            console.log(val)
            res.json({
                err:false,
                val:val
            })
        })
    }else{
        res.json({
            err:true,
            msg:'not ready'
        })
    }
})

app.listen(server_port, '0.0.0.0',() => {
  console.log(`Example app listening at http://localhost:${server_port}`)
})