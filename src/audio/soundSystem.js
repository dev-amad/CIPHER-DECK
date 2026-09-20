class SoundEngine {
    constructor() {
        this.ac = null;
        this.silent = false;
    }

    setup() {
        if (!this.ac && typeof window !== 'undefined') {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (AC) this.ac = new AC();
        }
        if (this.ac && this.ac.state === 'suspended') {
            this.ac.resume();
        }
    }

    setMuted(val) {
        this.silent = val;
    }

    isMuted() {
        return this.silent;
    }

    playKeyClick() {
        if (this.silent) return;
        this.setup();
        if (!this.ac) return;

        const t = this.ac.currentTime;
        const o = this.ac.createOscillator();
        const g = this.ac.createGain();
        const fl = this.ac.createBiquadFilter();

        o.type = 'triangle';
        o.frequency.setValueAtTime(1400 + Math.random() * 600, t);
        o.frequency.exponentialRampToValueAtTime(80, t + 0.02);

        fl.type = 'highpass';
        fl.frequency.setValueAtTime(900, t);

        g.gain.setValueAtTime(0.1, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);

        o.connect(fl);
        fl.connect(g);
        g.connect(this.ac.destination);

        o.start(t);
        o.stop(t + 0.03);
    }

    playDiskSeek() {
        if (this.silent) return;
        this.setup();
        if (!this.ac) return;

        const now = this.ac.currentTime;
        [0, 0.05, 0.12, 0.18].forEach((d, i) => {
            const o = this.ac.createOscillator();
            const g = this.ac.createGain();
            o.type = 'sawtooth';
            const pitch = i % 2 === 0 ? 880 : 550;
            o.frequency.setValueAtTime(pitch, now + d);
            o.frequency.exponentialRampToValueAtTime(pitch * 0.6, now + d + 0.03);

            g.gain.setValueAtTime(0.05, now + d);
            g.gain.exponentialRampToValueAtTime(0.0005, now + d + 0.035);

            o.connect(g);
            g.connect(this.ac.destination);
            o.start(now + d);
            o.stop(now + d + 0.04);
        });
    }

    playToggle() {
        if (this.silent) return;
        this.setup();
        if (!this.ac) return;

        const t = this.ac.currentTime;
        const o = this.ac.createOscillator();
        const g = this.ac.createGain();

        o.type = 'square';
        o.frequency.setValueAtTime(400, t);
        o.frequency.exponentialRampToValueAtTime(100, t + 0.025);

        g.gain.setValueAtTime(0.07, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

        o.connect(g);
        g.connect(this.ac.destination);
        o.start(t);
        o.stop(t + 0.035);
    }

    playBeep(freq = 880, dur = 0.08) {
        if (this.silent) return;
        this.setup();
        if (!this.ac) return;

        const t = this.ac.currentTime;
        const o = this.ac.createOscillator();
        const g = this.ac.createGain();

        o.type = 'sine';
        o.frequency.setValueAtTime(freq, t);

        g.gain.setValueAtTime(0.09, t);
        g.gain.exponentialRampToValueAtTime(0.0005, t + dur);

        o.connect(g);
        g.connect(this.ac.destination);
        o.start(t);
        o.stop(t + dur + 0.01);
    }

    playError() {
        if (this.silent) return;
        this.setup();
        if (!this.ac) return;

        const t = this.ac.currentTime;
        const o = this.ac.createOscillator();
        const g = this.ac.createGain();

        o.type = 'sawtooth';
        o.frequency.setValueAtTime(130, t);
        o.frequency.setValueAtTime(95, t + 0.09);

        g.gain.setValueAtTime(0.15, t);
        g.gain.exponentialRampToValueAtTime(0.0005, t + 0.25);

        o.connect(g);
        g.connect(this.ac.destination);
        o.start(t);
        o.stop(t + 0.27);
    }

    playSuccess() {
        if (this.silent) return;
        this.setup();
        if (!this.ac) return;

        const t = this.ac.currentTime;
        [523, 659, 783, 1046].forEach((f, idx) => {
            const o = this.ac.createOscillator();
            const g = this.ac.createGain();
            const offset = idx * 0.07;

            o.type = 'sine';
            o.frequency.setValueAtTime(f, t + offset);

            g.gain.setValueAtTime(0.1, t + offset);
            g.gain.exponentialRampToValueAtTime(0.0005, t + offset + 0.18);

            o.connect(g);
            g.connect(this.ac.destination);
            o.start(t + offset);
            o.stop(t + offset + 0.2);
        });
    }

    playAccessGranted() {
        if (this.silent) return;
        this.setup();
        if (!this.ac) return;

        const t = this.ac.currentTime;
        [392, 493, 587, 783, 987].forEach((f, idx) => {
            const o = this.ac.createOscillator();
            const g = this.ac.createGain();
            const offset = idx * 0.035;

            o.type = 'triangle';
            o.frequency.setValueAtTime(f, t + offset);

            g.gain.setValueAtTime(0.08, t + offset);
            g.gain.exponentialRampToValueAtTime(0.0005, t + 0.8);

            o.connect(g);
            g.connect(this.ac.destination);
            o.start(t + offset);
            o.stop(t + 0.85);
        });
    }
}

export const sound = new SoundEngine();