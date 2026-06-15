import type { ChordDefinition, ChordQuality, ChordTone, NoteLetter } from "../../types/music";
import { transposeNote } from "./notes";

const QUALITY_TONES: Record<ChordQuality, ChordTone[]> = {
  major: [
    { degree: "1", semitones: 0 },
    { degree: "3", semitones: 4 },
    { degree: "5", semitones: 7 },
  ],
  minor: [
    { degree: "1", semitones: 0 },
    { degree: "b3", semitones: 3 },
    { degree: "5", semitones: 7 },
  ],
  dominant7: [
    { degree: "1", semitones: 0 },
    { degree: "3", semitones: 4 },
    { degree: "5", semitones: 7 },
    { degree: "b7", semitones: 10 },
  ],
  diminished: [
    { degree: "1", semitones: 0 },
    { degree: "b3", semitones: 3 },
    { degree: "b5", semitones: 6 },
  ],
};

const QUALITY_LABELS: Record<ChordQuality, string> = {
  major: "Maj",
  minor: "Min",
  dominant7: "7",
  diminished: "Dim",
};

const ROOTS: NoteLetter[] = ["C", "D", "E", "F", "G", "A", "B", "C#", "D#", "F#", "G#", "A#"];

const STARTER_QUALITIES: ChordQuality[] = ["major", "minor", "dominant7", "diminished"];

export const CHORD_LIBRARY: ChordDefinition[] = ROOTS.flatMap((root) =>
  STARTER_QUALITIES.map((quality) => ({
    id: `${root}-${quality}`,
    root,
    quality,
    label: `${root} ${QUALITY_LABELS[quality]}`,
    tones: QUALITY_TONES[quality],
  })),
);

export function getChordNotes(chord: ChordDefinition): NoteLetter[] {
  return chord.tones.map((tone) => transposeNote(chord.root, tone.semitones));
}
