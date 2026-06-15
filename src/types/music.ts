export type NoteLetter =
  | "C"
  | "C#"
  | "D"
  | "D#"
  | "E"
  | "F"
  | "F#"
  | "G"
  | "G#"
  | "A"
  | "A#"
  | "B";

export type ChordQuality = "major" | "minor" | "dominant7" | "diminished";

export type ChordTone = {
  degree: string;
  semitones: number;
};

export type ChordDefinition = {
  id: string;
  label: string;
  root: NoteLetter;
  quality: ChordQuality;
  tones: ChordTone[];
};

export type InstrumentDefinition = {
  id: string;
  label: string;
  family: string;
  soundingOffsetSemitones: number;
};

export type DetectedPitch = {
  frequency: number;
  clarity: number;
  midi: number;
  centsOff: number;
  noteName: NoteLetter;
  noteWithOctave: string;
};

export type FeedbackState = "idle" | "listening" | "correct" | "incorrect";
