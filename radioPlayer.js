const icy = require('icy')
const lame = require('@suldashi/lame')
const Speaker = require('speaker')

icy.get(process.argv[2], (res) => {
  res.pipe(new lame.Decoder()).pipe(new Speaker())
})
