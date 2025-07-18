// Simple sound system using Web Audio API
class SoundSystem {
  private audioContext: AudioContext | null = null
  private sounds: Map<string, AudioBuffer> = new Map()
  private enabled: boolean = true

  constructor() {
    // Initialize audio context on first user interaction
    this.initAudioContext()
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    } catch (error) {
      console.warn('Web Audio API not supported:', error)
      this.enabled = false
    }
  }

  // Generate simple tones for game sounds
  private createTone(frequency: number, duration: number, type: OscillatorType = 'sine'): AudioBuffer | null {
    if (!this.audioContext) return null

    const sampleRate = this.audioContext.sampleRate
    const numSamples = sampleRate * duration
    const buffer = this.audioContext.createBuffer(1, numSamples, sampleRate)
    const channelData = buffer.getChannelData(0)

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate
      let sample = 0

      switch (type) {
        case 'sine':
          sample = Math.sin(2 * Math.PI * frequency * t)
          break
        case 'square':
          sample = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1
          break
        case 'triangle':
          sample = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * frequency * t))
          break
      }

      // Apply envelope (fade in/out)
      const envelope = Math.min(t * 10, 1) * Math.min((duration - t) * 10, 1)
      channelData[i] = sample * envelope * 0.1 // Keep volume low
    }

    return buffer
  }

  // Initialize game sounds
  public initSounds() {
    if (!this.audioContext || !this.enabled) return

    // Create different sound effects
    const sounds = {
      step: this.createTone(200, 0.1, 'sine'),
      interact: this.createTone(400, 0.2, 'triangle'),
      questAccept: this.createTone(600, 0.3, 'sine'),
      questComplete: this.createTone(800, 0.5, 'triangle'),
      dialogue: this.createTone(300, 0.15, 'square'),
      error: this.createTone(150, 0.3, 'square')
    }

    // Store sounds
    Object.entries(sounds).forEach(([name, buffer]) => {
      if (buffer) {
        this.sounds.set(name, buffer)
      }
    })
  }

  public playSound(soundName: string, volume: number = 0.5) {
    if (!this.audioContext || !this.enabled) return

    const buffer = this.sounds.get(soundName)
    if (!buffer) return

    try {
      const source = this.audioContext.createBufferSource()
      const gainNode = this.audioContext.createGain()
      
      source.buffer = buffer
      gainNode.gain.value = Math.min(Math.max(volume, 0), 1)
      
      source.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      source.start()
    } catch (error) {
      console.warn('Error playing sound:', error)
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  public isEnabled(): boolean {
    return this.enabled
  }
}

export const soundSystem = new SoundSystem()

// Initialize sounds on first user interaction
let soundsInitialized = false
export const initSoundsOnInteraction = () => {
  if (!soundsInitialized) {
    soundSystem.initSounds()
    soundsInitialized = true
  }
}