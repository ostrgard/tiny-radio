const icy = require('icy')
const lame = require('@suldashi/lame')
const Speaker = require('speaker')

class RadioPlayer {
  constructor(url) {
    this.playing = false
    this.url = url
  }

  stop() {
    this.playing = false
    this.currentStation = undefined
    this.currentSong = undefined
    if (this.stopCurrentRadio) this.stopCurrentRadio()
  }

  play() {
    icy.get(this.url, (res) => {
      res.pipe(new lame.Decoder()).pipe(new Speaker())

      res.on('metadata', (metadata) => {
        const parsed = icy.parse(metadata)
        this.currentSong = parsed.StreamTitle
      })

      this.currentStation = res.headers['icy-name']
      this.playing = true
      this.stopCurrentRadio = () => {
        res.destroy()
        this.stopCurrentRadio = undefined
      }
    })
  }
}

module.exports = RadioPlayer
