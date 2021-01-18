const express = require('express')
const childProcess = require('child_process')
const args = require('./args')
const volume = require('./volume')

const app = express()
let radioProcess
let currentlyPlaying = null

const getStatus = () => ({
  currentlyPlaying,
  volume: volume.getVolume(),
  playing: Boolean(radioProcess),
})

const startRadioProcess = () => {
  return new Promise((resolve) => {
    if (radioProcess) radioProcess.kill()
    radioProcess = childProcess.fork('./radioPlayer', [args.url])
    radioProcess.on('message', (data) => {
      currentlyPlaying = data
      resolve()
    })
  })
}

const stopRadioProcess = () => {
  radioProcess.kill()
  radioProcess = undefined
  currentlyPlaying = null
}

app.post('/start', (req, res) => {
  startRadioProcess().then(() => {
    res.send(getStatus())
  })
})

app.post('/stop', (req, res) => {
  if (radioProcess) {
    stopRadioProcess()
  }
  res.send(getStatus())
})

app.post('/toggle', (req, res) => {
  if (radioProcess) {
    stopRadioProcess()
    res.send('stopped')
  } else {
    startRadioProcess().then(() => {
      res.send(getStatus())
    })
  }
})

app.get('/state', (req, res) => {
  res.send(getStatus())
})

app.post('/volume/up', (req, res) => {
  volume.increase()
  res.send(getStatus())
})

app.post('/volume/down', (req, res) => {
  volume.decrease()
  res.send(getStatus())
})

app.post('/volume/:volume', (req, res) => {
  const v = Number(req.params.volume)
  if (v && !Number.isNaN(v)) {
    volume.set(Math.max(0, Math.min(100, v)))
  }
  res.send(getStatus())
})

app.listen(args.port, () => {
  console.log(
    `Tiny Radio started and can be controlled through http://localhost:${args.port}. Read the README for instructions.`
  )
  if (args.playOnStart) {
    startRadioProcess()
  }
})
