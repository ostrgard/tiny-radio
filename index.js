const express = require('express')
const childProcess = require('child_process')
const args = require('./args')
const volume = require('./volume')

const app = express()
const port = 3000
let radioProcess

const startRadioProcess = () => {
  if (radioProcess) radioProcess.kill()
  radioProcess = childProcess.fork('./radioPlayer', [args.url])
  console.log('started')
}

const stopRadioProcess = () => {
  radioProcess.kill()
  radioProcess = undefined
  console.log('stopped')
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

app.post('/volume/up', (req, res) => {
  volume.increase()
  const msg = `increased volume`
  console.log(msg)
  res.send(msg)
})

app.post('/volume/down', (req, res) => {
  volume.decrease()
  const msg = `decreased volume`
  console.log(msg)
  res.send(msg)
})

app.listen(port, () => {
  console.log(`Tiny Radio can be controlled through http://localhost:${port}`)
})
