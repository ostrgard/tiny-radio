const getArg = (arg) => {
  const a = process.argv.find((n) => n.startsWith(`--${arg}`))
  if (!a) return undefined
  return a.startsWith(`--${arg}=`) ? a.replace(`--${arg}=`, '') : true
}

module.exports = {
  url: getArg('url'),
  audioSink: getArg('audioSink'),
}
