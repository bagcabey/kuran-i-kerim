// kimatik_lab/audio_lab/core/mic_manager.js
// Tek Stream Mikrofon Yöneticisi ve Kayıt Altyapısı

import { masterBus } from './master_bus.js';
import { droneSynth } from '../instruments/drone_v2.js';

export class MicrophoneManager {
  constructor() {
    this.stream = null;
    this.sourceNode = null;
    this.workletNode = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.listeners = new Set();
    this.isActive = false;
    this.isRecording = false;
    this.hasHeadphonesWarning = false;
  }

  async start() {
    if (this.isActive) return;

    const ctx = await masterBus.ensureContext();

    // Worklet modülünü yükle
    try {
      await ctx.audioWorklet.addModule('audio_lab/core/yin_processor.worklet.js');
    } catch (e) {
      console.warn('Worklet zaten yüklü veya göreli yol uyarısı:', e);
    }

    // Saf Müzikal Ses Kısıtlamaları
    const constraints = {
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        sampleRate: ctx.sampleRate
      }
    };

    try {
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.sourceNode = ctx.createMediaStreamSource(this.stream);

      this.workletNode = new AudioWorkletNode(ctx, 'yin-pitch-processor');
      this.workletNode.port.onmessage = (e) => this.handleWorkletMessage(e.data);

      this.sourceNode.connect(this.workletNode);
      this.isActive = true;
    } catch (err) {
      console.error('Mikrofon erişim hatası:', err);
      throw err;
    }
  }

  handleWorkletMessage(data) {
    // Anti-Drone Feedback Koruması
    if (droneSynth.isPlaying && data.voiced && data.hz > 0) {
      const droneHz = droneSynth.currentHz;
      const ratio = data.hz / droneHz;
      // Kullanıcının mikrofona giren ses drone ile 0.99 - 1.01 oranında birebir örtüşüyorsa
      if (Math.abs(ratio - 1.0) < 0.015 || Math.abs(ratio - 2.0) < 0.015) {
        if (!this.hasHeadphonesWarning) {
          console.warn('UYARI: Hoparlörden çıkan karar sesi mikrofona sızıyor. Lütfen kulaklık kullanın.');
          this.hasHeadphonesWarning = true;
        }
      }
    }

    // Dinleyicilere yay
    for (const listener of this.listeners) {
      listener(data);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Model ile kıyaslama için temiz ses kaydı başlatır.
   */
  startRecording() {
    if (!this.stream) throw new Error('Mikrofon aktif değil.');
    this.audioChunks = [];

    // Platforma uygun MIME tipi seçimi (iOS Safari mp4 ister)
    let mimeType = 'audio/webm;codecs=opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'audio/mp4';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = ''; // Tarayıcının varsayılanına bırak
      }
    }

    const options = mimeType ? { mimeType } : {};
    this.mediaRecorder = new MediaRecorder(this.stream, options);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start(100);
    this.isRecording = true;
  }

  /**
   * Kaydı durdurur ve ses Blob URL'ini döndürür.
   * @returns {Promise<string>} Blob URL
   */
  async stopRecording() {
    if (!this.mediaRecorder || !this.isRecording) return null;

    return new Promise((resolve) => {
      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(this.audioChunks, { type: mimeType });
        const audioUrl = URL.createObjectURL(blob);
        this.isRecording = false;
        resolve(audioUrl);
      };
      this.mediaRecorder.stop();
    });
  }

  stop() {
    if (this.sourceNode) {
      try { this.sourceNode.disconnect(); } catch (e) {}
      this.sourceNode = null;
    }
    if (this.workletNode) {
      try { this.workletNode.disconnect(); } catch (e) {}
      this.workletNode = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.isActive = false;
  }
}

export const micManager = new MicrophoneManager();
