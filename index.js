const express = require('express')
const childProcess = require('child_process')

const app = express()
const port = 3000
const radioUrl = 'http://live-icy.gss.dr.dk/A/A29H.mp3'
let radioProcess

const startRadioProcess = () => {
  if (radioProcess) radioProcess.kill()
  radioProcess = childProcess.fork('./radioPlayer', [radioUrl])
}

const stopRadioProcess = () => {
  radioProcess.kill()
  radioProcess = undefined
}

app.post('/start', (req, res) => {
  startRadioProcess()
  res.send('started')
})

app.post('/stop', (req, res) => {
  if (radioProcess) {
    stopRadioProcess()
    res.send('stopped')
  } else {
    res.send('already stopped')
  }
})

app.post('/toggle', (req, res) => {
  if (radioProcess) {
    stopRadioProcess()
    res.send('stopped')
  } else {
    startRadioProcess()
    res.send('started')
  }
})

app.get('/state', (req, res) => {
  if (radioProcess) {
    res.send('playing')
  } else {
    res.send('stopped')
  }
})

app.listen(port, () => {
  console.log(`Tiny Radio can be controlled through http://localhost:${port}`)
})
