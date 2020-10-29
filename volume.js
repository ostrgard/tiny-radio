const childProcess = require('child_process')
const args = require('./args')

let currentVolume = 50

const setVolume = (volume = currentVolume) => {
  currentVolume = Math.min(100, Math.max(0, volume))
  const mappedVolume = currentVolume * 4 + 100

  childProcess.exec(
    // Set the audio-sink volume, then select it as default sink. This order
    // ensures that we're not accidentally blasting full volume out before
    // adjusting volume.
    `pactl set-sink-volume ${args.audioSink} ${mappedVolume} && pactl set-default-sink ${args.audioSink}`
  )
}

// Running this at a 5 seconds interval, which ensures that we connect to the
// audio-sink if it becomes available.
setInterval(setVolume, 1000 * 5)

module.exports = {
  increase: () => setVolume(currentVolume + 2),
  decrease: () => setVolume(currentVolume - 2),
}
