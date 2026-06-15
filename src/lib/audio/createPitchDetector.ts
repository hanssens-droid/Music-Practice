import { PitchDetector } from "pitchy";
import { frequencyToDetectedPitch } from "../music/notes";
import type { DetectedPitch } from "../../types/music";

const MIN_SIGNAL_RMS = 0.012;
const MIN_DISPLAY_CLARITY = 0.72;
const MIN_SAX_FREQUENCY = 80;
const MAX_SAX_FREQUENCY = 1400;

function getRms(buffer: Float32Array<ArrayBufferLike>): number {
  const sumOfSquares = buffer.reduce((sum, sample) => sum + sample * sample, 0);

  return Math.sqrt(sumOfSquares / buffer.length);
}

export function detectPitchFromBuffer(
  buffer: Float32Array<ArrayBufferLike>,
  sampleRate: number,
): DetectedPitch | null {
  if (getRms(buffer) < MIN_SIGNAL_RMS) {
    return null;
  }

  const detector = PitchDetector.forFloat32Array(buffer.length);
  const [frequency, clarity] = detector.findPitch(
    buffer as Float32Array<ArrayBuffer>,
    sampleRate,
  );

  if (
    !Number.isFinite(frequency) ||
    frequency < MIN_SAX_FREQUENCY ||
    frequency > MAX_SAX_FREQUENCY ||
    clarity < MIN_DISPLAY_CLARITY
  ) {
    return null;
  }

  return frequencyToDetectedPitch(frequency, clarity);
}
