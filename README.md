# Tiny radio
This is a tiny library that spins up a process playing the provided radio url and exposes a REST-based interface for pausing, playing and controlling volume.

I'm running this on a Raspberry Pi (Ubuntu) connected via USB to my stereo. I interact with the REST API through Home Assistant in various ways.

## Example
Spinning up P6 Beat.
```
node index.js --url="http://live-icy.gss.dr.dk/A/A29H.mp3" --playOnStart
```

### Options
`--playOnStart`: false by default.

`--port`: defaults to `3000`.

`--volumeIncrements`: defaults to `5`.

`--initialVolume`: defaults to `50`.

## REST API
`POST /start`: starts the radio process. Returns current state.

`POST /stop`: stops the radio process. Returns current state.

`POST /toggle`: starts or stops the radio process. Returns current state.

`GET /state`: returns current state.

`POST /volume/up`: increases volume by 5 or provided `--volumeIncrements`. Returns current state.

`POST /volume/down`: decreases volume by 5 or provided `--volumeIncrements`. Returns current state.

`POST /volume/:volume`: sets the volume to whatever provided ie. `/volume/10`. Returns current state.

### State
Every `POST` call returns the current state which is an object containing these fields:

`currentlyPlaying`: string. The stream title returned by streaming the url.

`volume`: int. Current volume.

`playing`: boolean. Whether or not the radio is currently playing.

## Controlling volume
To control volume you'll need to provide an audio sink and have `pactl` installed on your hots system:
```
 --audioSink="alsa_output.usb-D___M_Holdings_Inc._PMA-50-00.analog-stereo"
```

Find your audio-sink by running `pactl list`. This entire approach could very likely be handled better and more widely supported, but I've just focused on Ubuntu for now. Take a look at the source if you want to see some really hacky stuff. Sorry.