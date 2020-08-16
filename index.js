const express = require('express')
const app = express()
const port = 3000
let state='conn'
const Firmata = require("firmata");
var cors = require('cors')
const board = new Firmata("COM3");
 
board.on("ready", function(){
    state='ready'
});

app.use(cors())

app.get('/', (req, res) => {
  res.send(state)
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


app.get('/:pin/:value', (req, res) => {
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


app.get('/pwm/:pin/:value', (req, res) => {
    const pin = parseInt(req.params.pin)
    const val = parseInt(req.params.value)
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})