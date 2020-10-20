const RadioPlayer = require('./RadioPlayer')

const radioPlayer = new RadioPlayer('http://live-icy.gss.dr.dk/A/A29H.mp3')
radioPlayer.play()

setTimeout(() => {
  console.log(radioPlayer.currentStation, radioPlayer.currentSong)
  radioPlayer.stop()
}, 1000)
