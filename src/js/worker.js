importScripts('https://cdn.jsdelivr.net/gh/psych0der/pngquantjs@master/demo/js/pngquant.min.js')

onmessage = (e) => {
  const { file, options } = e.data
  const result = pngquant(file, options, console.log)
  postMessage(result)
}
