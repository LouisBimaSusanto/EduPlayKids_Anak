"use client";

import { useCallback, useState, useEffect } from "react";

// In a real app, these would map to actual .mp3/.wav files
const SOUND_MAP = {
  bloop: 800, // frequency for a 'bloop'
  success: 1200,
  fail: 300,
};

export function useAudio() {
  const playSound = useCallback((soundName) => {
    try {
      // Create a short beep to act as a placeholder for actual audio files
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(SOUND_MAP[soundName] || 600, ctx.currentTime);
      
      // Fast attack and decay for a "bloop" or "pop" sound
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn("Audio play failed or is not supported", e);
    }
  }, []);

  return { playSound };
}

export function useTTS() {
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    loadVoices();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = useCallback((text, onEndCallback) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel(); // Stop any currently playing audio
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "id-ID"; // Indonesian language
      
      // Filter for Indonesian voices
      const indoVoices = voices.filter(v => v.lang === 'id-ID' || v.lang === 'id_ID');
      
      // Try to find Google's voice (usually higher quality/friendly) or a female voice
      const friendlyVoice = indoVoices.find(v => v.name.toLowerCase().includes('google')) || 
                            indoVoices.find(v => v.name.toLowerCase().includes('female')) || 
                            indoVoices[0]; // fallback to whatever ID voice is available
      
      if (friendlyVoice) {
        utterance.voice = friendlyVoice;
      }

      // Slower rate is clearer for kids. Pitch 1.4 is cute without being squeaky.
      utterance.rate = 0.9; 
      utterance.pitch = 1.3; 
      
      if (onEndCallback) {
        utterance.onend = onEndCallback;
      }
      
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback if TTS not supported
      if (onEndCallback) onEndCallback();
    }
  }, [voices]);

  // In the future Production version, replace useTTS with useVoiceActor:
  /*
  const playVoiceActor = useCallback((audioUrl, onEndCallback) => {
    const audio = new Audio(audioUrl);
    audio.onended = onEndCallback;
    audio.play();
  }, []);
  */

  return { speak };
}
