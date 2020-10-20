const RadioPlayer = require('./RadioPlayer')

const radioPlayer = new RadioPlayer('http://live-icy.gss.dr.dk/A/A29H.mp3')
radioPlayer.play()
console.log(radioPlayer.currentStation)
setTimeout(() => radioPlayer.stop(), 1000)