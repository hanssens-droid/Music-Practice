import type { NoteLetter } from "../../types/music";

export const CHROMATIC_NOTES: NoteLetter[] = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

export function frequencyToMidi(frequency: number): number {
  return Math.round(69 + 12 * Math.log2(frequency / 440));
}

export function midiToFrequency(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12);
}

export function midiToNoteName(midi: number): NoteLetter {
  return CHROMATIC_NOTES[((midi % 12) + 12) % 12];
}

export function midiToNoteWithOctave(midi: number): string {
  const octave = Math.floor(midi / 12) - 1;
  return `${midiToNoteName(midi)}${octave}`;
}

export function centsDifference(frequency: number, targetFrequency: number): number {
  return 1200 * Math.log2(frequency / targetFrequency);
}

export function transposeNote(note: NoteLetter, semitones: number): NoteLetter {
  const startIndex = CHROMATIC_NOTES.indexOf(note);
  return CHROMATIC_NOTES[(startIndex + semitones + 1200) % 12];
}

export function frequencyToDetectedPitch(frequency: number, clarity: number) {
  const midi = frequencyToMidi(frequency);

  return {
    frequency,
    clarity,
    midi,
    centsOff: centsDifference(frequency, midiToFrequency(midi)),
    noteName: midiToNoteName(midi),
    noteWithOctave: midiToNoteWithOctave(midi),
  };
}
