const express = require('express')
const childProcess = require('child_process')
const loudness = require('loudness')

const app = express()
const port = 3000
let radioProcess

const startRadioProcess = () => {
  try {
    if (radioProcess) radioProcess.kill()
    radioProcess = childProcess.fork('./radioPlayer', [process.argv[2]])
    console.log('started')
  } catch (e) {
    console.error('failed to start, trying again in 10 seconds', e)
    setTimeout(startRadioProcess, 10000)
  }
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

app.post('/volume/up', async (req, res) => {
  const vol = await loudness.getVolume()
  await loudness.setVolume(vol + 1)
  const msg = `volume set to ${await loudness.getVolume()}`
  console.log(msg)
  res.send(msg)
})

app.post('/volume/down', async (req, res) => {
  const vol = await loudness.getVolume()
  await loudness.setVolume(vol - 1)
  const msg = `volume set to ${await loudness.getVolume()}`
  console.log(msg)
  res.send(msg)
})

app.listen(port, () => {
  console.log(`Tiny Radio can be controlled through http://localhost:${port}`)
})

if (process.argv.includes('--playOnStart')) {
  startRadioProcess()
}
