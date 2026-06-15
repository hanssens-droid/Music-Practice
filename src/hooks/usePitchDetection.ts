import { useCallback, useEffect, useRef, useState } from "react";
import type { DetectedPitch } from "../types/music";
import { detectPitchFromBuffer } from "../lib/audio/createPitchDetector";

type PitchDetectionState = {
  error: string | null;
  isListening: boolean;
  pitch: DetectedPitch | null;
  start: () => Promise<void>;
  stop: () => void;
};

export function usePitchDetection(): PitchDetectionState {
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [pitch, setPitch] = useState<DetectedPitch | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const bufferRef = useRef<Float32Array<ArrayBuffer> | null>(null);

  const stop = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    void audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;
    bufferRef.current = null;

    setIsListening(false);
    setPitch(null);
  }, []);

  const readPitch = useCallback(() => {
    const analyser = analyserRef.current;
    const audioContext = audioContextRef.current;
    const buffer = bufferRef.current;

    if (!analyser || !audioContext || !buffer) {
      return;
    }

    analyser.getFloatTimeDomainData(buffer);
    setPitch(detectPitchFromBuffer(buffer, audioContext.sampleRate));
    frameRef.current = requestAnimationFrame(readPitch);
  }, []);

  const start = useCallback(async () => {
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 2048;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      streamRef.current = stream;
      bufferRef.current = new Float32Array(analyser.fftSize);

      setIsListening(true);
      frameRef.current = requestAnimationFrame(readPitch);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Microphone access could not be started.",
      );
      stop();
    }
  }, [readPitch, stop]);

  useEffect(() => stop, [stop]);

  return {
    error,
    isListening,
    pitch,
    start,
    stop,
  };
}
