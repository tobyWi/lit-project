let sharedAudioContext: AudioContext | null = null;

function getAudioContext() {
  if (sharedAudioContext) {
    return sharedAudioContext;
  }

  if (!("AudioContext" in window)) {
    return null;
  }

  sharedAudioContext = new AudioContext();
  return sharedAudioContext;
}

function withContext(run: (ctx: AudioContext, now: number) => void) {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    void ctx.resume();
  }

  run(ctx, ctx.currentTime);
}

export function playAccordionPop() {
  withContext((ctx, now) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.09);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.065, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.11);
  });
}

export function playMeterRiseTick(step: number) {
  withContext((ctx, now) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const clampedStep = Math.max(1, Math.min(step, 8));
    const startFreq = 430 + clampedStep * 38;
    const endFreq = startFreq + 90;

    osc.type = "square";
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.045);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.045, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  });
}

export function playUnlockFanfare() {
  withContext((ctx, now) => {
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.072, now + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.52);
    gain.connect(ctx.destination);

    const notes = [
      { freq: 523.25, start: 0, end: 0.11 },
      { freq: 659.25, start: 0.12, end: 0.23 },
      { freq: 783.99, start: 0.24, end: 0.35 },
    ];

    for (const note of notes) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(note.freq, now + note.start);
      osc.connect(gain);
      osc.start(now + note.start);
      osc.stop(now + note.end);
    }

    const chord = [659.25, 830.61, 987.77];
    for (const freq of chord) {
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + 0.34);
      osc.connect(gain);
      osc.start(now + 0.34);
      osc.stop(now + 0.5);
    }
  });
}

export function playHelloChime() {
  withContext((ctx, now) => {
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    gain.connect(ctx.destination);

    const oscA = ctx.createOscillator();
    oscA.type = "sine";
    oscA.frequency.setValueAtTime(587.33, now);
    oscA.connect(gain);
    oscA.start(now);
    oscA.stop(now + 0.09);

    const oscB = ctx.createOscillator();
    oscB.type = "triangle";
    oscB.frequency.setValueAtTime(783.99, now + 0.08);
    oscB.connect(gain);
    oscB.start(now + 0.08);
    oscB.stop(now + 0.18);
  });
}
