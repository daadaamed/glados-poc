const synth = typeof window !== "undefined" ? window.speechSynthesis : null

export function isSupported() {
  return !!synth
}

export function getVoices() {
  if (!isSupported()) return []
  return synth.getVoices()
}

export function onVoicesChanged(cb) {
  if (!isSupported()) return
  synth.onvoiceschanged = cb
}

export function cancel() {
  if (!isSupported()) return
  synth.cancel()
}

export function pause() {
  if (!isSupported()) return
  synth.pause()
}

export function resume() {
  if (!isSupported()) return
  synth.resume()
}

export function speakQueue(chunks, {
  voice, rate = 1.0, pitch = 1.0, lang = "en-US", onEnd 
} = {}) {
  if (!isSupported() || !chunks?.length) return
  cancel()
  const queue = chunks.map(text => {
    const u = new SpeechSynthesisUtterance(text)
    if (voice) u.voice = voice
    u.rate = rate
    u.pitch = pitch
    u.lang = lang
    return u
  })
  queue.forEach((u, idx) => {
    if (idx === queue.length - 1 && onEnd) u.onend = onEnd
    synth.speak(u)
  })
}
