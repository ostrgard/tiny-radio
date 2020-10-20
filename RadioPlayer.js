const icy = require('icy');
const lame = require('@suldashi/lame');
const Speaker = require('speaker');

class RadioPlayer {
  constructor(url) {
    this.playing = false
    this.url = url
    this.currentStation = undefined
  }

  stop() {
    this.playing = false
    this.currentStation = undefined
    if (this.stopCurrentRadio) this.stopCurrentRadio()
  }

  play() {
    icy.get(this.url, res => {
      this.playing = true
      this.currentStation = res.headers['icy-name']

      res.on('metadata', metadata => {
        var parsed = icy.parse(metadata);
        console.error('Now playing', parsed.StreamTitle);
      });

      res.pipe(new lame.Decoder())
         .pipe(new Speaker());

      if (!this.playing) {
        res.destroy()
        this.stop()
      } else {
        this.stopCurrentRadio = () => {
          res.destroy()
          this.stopCurrentRadio = undefined
        }
      }
    });
  }
}

module.exports = RadioPlayer
