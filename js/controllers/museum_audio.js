/**
 * 🛰️ ATELIER MATEMÁTICO — SUBSISTEMA DE AUDIO & VOZ NAI CENTINELA
 * Web Audio API Sintetizado & Web Speech Synthesis
 * Gobernanza: Timonel F2 · Cero Dependencias · Silicio Nativo
 */

(function(root) {
  'use strict';

  let telescopeAudioCtx = null;
  let voiceGuideEnabled = true;
  let isSpeaking = false;
  let currentUtterance = null;

  function getAudioContext() {
    if (!telescopeAudioCtx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) telescopeAudioCtx = new AudioCtx();
    }
    if (telescopeAudioCtx && telescopeAudioCtx.state === 'suspended') {
      telescopeAudioCtx.resume();
    }
    return telescopeAudioCtx;
  }

  function playServoSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(115, now);
      osc.frequency.exponentialRampToValueAtTime(245, now + 0.3);
      osc.frequency.exponentialRampToValueAtTime(130, now + 0.95);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 1.15);
    } catch (e) {}
  }

  function playShutterSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  function enterCapsule(enableVoice) {
    voiceGuideEnabled = enableVoice;
    updateVoiceStatusUI();
    if (typeof document !== 'undefined') {
      const foyer = document.getElementById('foyer-screen');
      if (foyer) {
        foyer.style.opacity = '0';
        setTimeout(() => {
          foyer.style.setProperty('display', 'none', 'important');
          foyer.classList.add('hidden');
        }, 800);
      }
    }
    speakNai("Bienvenido a la Rotonda de Timonel. 100 leyes del cosmos se están desenredando en silicio.");
  }

  function toggleVoiceGuide() {
    voiceGuideEnabled = !voiceGuideEnabled;
    if (!voiceGuideEnabled) stopNaiSpeech();
    updateVoiceStatusUI();
  }

  function updateVoiceStatusUI() {
    if (typeof document === 'undefined') return;
    const icon = document.getElementById('voice-status-icon');
    if (icon) icon.textContent = voiceGuideEnabled ? 'Audio On' : 'Audio Off';
    const txt = document.getElementById('voice-status-text');
    if (txt) txt.textContent = voiceGuideEnabled ? 'Voz Activa' : 'En Silencio';
  }

  function speakNai(text) {
    if (!voiceGuideEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    stopNaiSpeech();
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = 'es-ES';
    currentUtterance.rate = 0.94;
    currentUtterance.pitch = 0.96;
    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.find(v => v.lang.startsWith('es'));
    if (esVoice) currentUtterance.voice = esVoice;
    currentUtterance.onstart = () => {
      isSpeaking = true;
      const el = document.getElementById('nai-voice-waves');
      if (el) el.classList.remove('hidden');
    };
    currentUtterance.onend = () => {
      isSpeaking = false;
      const el = document.getElementById('nai-voice-waves');
      if (el) el.classList.add('hidden');
    };
    window.speechSynthesis.speak(currentUtterance);
  }

  function stopNaiSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isSpeaking = false;
    if (typeof document !== 'undefined') {
      const el = document.getElementById('nai-voice-waves');
      if (el) el.classList.add('hidden');
    }
  }

  function toggleAudioGuide() {
    const astro = root.currentFocusedAstro;
    if (astro && astro.data) {
      speakNai(`Obra ${astro.data.badge || ''}. ${astro.data.title || ''}. ${astro.data.hist || ''} ${astro.data.poem || ''}`);
    }
  }

  const MuseumAudio = {
    getAudioContext,
    playServoSound,
    playShutterSound,
    enterCapsule,
    toggleVoiceGuide,
    updateVoiceStatusUI,
    speakNai,
    stopNaiSpeech,
    toggleAudioGuide,
    get isVoiceEnabled() { return voiceGuideEnabled; },
    get isSpeaking() { return isSpeaking; }
  };

  root.MuseumAudio = MuseumAudio;

  // Bindings globales de compatibilidad con onclick HTML
  root.playServoSound = playServoSound;
  root.playShutterSound = playShutterSound;
  root.enterCapsule = enterCapsule;
  root.toggleVoiceGuide = toggleVoiceGuide;
  root.updateVoiceStatusUI = updateVoiceStatusUI;
  root.speakNai = speakNai;
  root.stopNaiSpeech = stopNaiSpeech;
  root.toggleAudioGuide = toggleAudioGuide;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MuseumAudio;
  }

})(typeof window !== 'undefined' ? window : global);
