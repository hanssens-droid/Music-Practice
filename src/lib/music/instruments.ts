import type { InstrumentDefinition, NoteLetter } from "../../types/music";
import { transposeNote } from "./notes";

export const INSTRUMENTS: InstrumentDefinition[] = [
  {
    id: "trumpet",
    label: "Trumpet",
    family: "Bb instrument",
    soundingOffsetSemitones: -2,
  },
  {
    id: "alto-saxophone",
    label: "Alto saxophone",
    family: "Eb instrument",
    soundingOffsetSemitones: 3,
  },
  {
    id: "tenor-saxophone",
    label: "Tenor saxophone",
    family: "Bb instrument",
    soundingOffsetSemitones: -2,
  },
  {
    id: "clarinet",
    label: "Clarinet",
    family: "Bb instrument",
    soundingOffsetSemitones: -2,
  },
];

export function getSoundingNote(
  writtenNote: NoteLetter,
  instrument: InstrumentDefinition,
): NoteLetter {
  return transposeNote(writtenNote, instrument.soundingOffsetSemitones);
}

export function getWrittenNoteFromSounding(
  soundingNote: NoteLetter,
  instrument: InstrumentDefinition,
): NoteLetter {
  return transposeNote(soundingNote, -instrument.soundingOffsetSemitones);
}
