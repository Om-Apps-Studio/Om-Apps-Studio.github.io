// Audio & Speech Synthesis Service for Workout Whistle, Alert Beeps, and Voice Coaching

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch (err) {
    console.warn('AudioContext creation warning:', err);
    return null;
  }
}

export let isSoundEnabled = true;
export let isVoiceEnabled = true;

export function setSoundEnabled(enabled: boolean) {
  isSoundEnabled = enabled;
}

export function setVoiceEnabled(enabled: boolean) {
  isVoiceEnabled = enabled;
}

/**
 * Synthesizes a high-pitch athletic whistle blast using Web Audio API.
 */
export function playWhistleSound() {
  if (!isSoundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const tremolo = ctx.createOscillator();
    const tremoloGain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(2650, now);
    osc1.frequency.exponentialRampToValueAtTime(2950, now + 0.3);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(2850, now);
    osc2.frequency.exponentialRampToValueAtTime(3150, now + 0.3);

    tremolo.type = 'sine';
    tremolo.frequency.setValueAtTime(35, now);
    tremoloGain.gain.setValueAtTime(0.3, now);
    tremolo.connect(tremoloGain);

    gainNode.gain.setValueAtTime(0.01, now);
    gainNode.gain.linearRampToValueAtTime(0.35, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    tremolo.start(now);

    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
    tremolo.stop(now + 0.35);
  } catch (err) {
    console.warn('Whistle sound play warning:', err);
  }
}

/**
 * Synthesizes a countdown alert beep or pitch tone.
 */
export function playAlertBeep(frequency: number = 800, durationMs: number = 150) {
  if (!isSoundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + durationMs / 1000);
  } catch (err) {
    console.warn('Beep sound warning:', err);
  }
}

/**
 * Synthesizes a completion chime (C5-E5-G5 chord).
 */
export function playChimeSound() {
  if (!isSoundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + idx * 0.1;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.6);
    });
  } catch (err) {
    console.warn('Chime sound warning:', err);
  }
}

/**
 * Speaks text using Web SpeechSynthesis API.
 */
export function speakVoice(text: string) {
  if (!isVoiceEnabled || !('speechSynthesis' in window)) return;
  try {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis warning:', err);
  }
}
