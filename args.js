const getArg = (arg) => {
  const a = process.argv.find((n) => n.startsWith(`--${arg}`))
  if (!a) return undefined
  return a.startsWith(`--${arg}=`) ? a.replace(`--${arg}=`, '') : true
}

module.exports = {
  url: getArg('url'),
  audioSink: getArg('audioSink'),
  debug: getArg('playOnStart') || false,
  playOnStart: getArg('playOnStart') || false,
  port: getArg('port') || 3000,
  initialVolume: getArg('initialVolume') || 50,
  volumeIncrements: getArg('volumeIncrements') || 5,
}
