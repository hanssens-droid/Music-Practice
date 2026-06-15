import type { ChordDefinition, DetectedPitch, FeedbackState, NoteLetter } from "../../types/music";
import { getChordNotes } from "../music/chords";

export type ExerciseState = {
  targetIndex: number;
  feedback: FeedbackState;
  lastDetectedNote?: NoteLetter;
};

export type ExerciseEvaluation = ExerciseState & {
  completedRound: boolean;
};

export const MATCH_HOLD_MS = 1300;
const MATCH_GRACE_MS = 260;
const MIN_ACCEPT_CLARITY = 0.78;

export function getTargetNote(chord: ChordDefinition, targetIndex: number): NoteLetter {
  return getChordNotes(chord)[targetIndex];
}

export function evaluatePitch(
  chord: ChordDefinition,
  soundingTargetNote: NoteLetter,
  state: ExerciseState,
  pitch: DetectedPitch | null,
  previousMatchStartedAt: number | null,
  previousMismatchStartedAt: number | null,
  now: number,
): {
  nextState: ExerciseEvaluation;
  nextMatchStartedAt: number | null;
  nextMismatchStartedAt: number | null;
} {
  if (!pitch || pitch.clarity < MIN_ACCEPT_CLARITY) {
    if (previousMatchStartedAt && !previousMismatchStartedAt) {
      return {
        nextState: {
          ...state,
          feedback: "correct",
          completedRound: false,
        },
        nextMatchStartedAt: previousMatchStartedAt,
        nextMismatchStartedAt: now,
      };
    }

    if (
      previousMatchStartedAt &&
      previousMismatchStartedAt &&
      now - previousMismatchStartedAt < MATCH_GRACE_MS
    ) {
      return {
        nextState: {
          ...state,
          feedback: "correct",
          completedRound: false,
        },
        nextMatchStartedAt: previousMatchStartedAt,
        nextMismatchStartedAt: previousMismatchStartedAt,
      };
    }

    return {
      nextState: {
        ...state,
        feedback: "listening",
        completedRound: false,
      },
      nextMatchStartedAt: null,
      nextMismatchStartedAt: null,
    };
  }

  const isCorrect = pitch.noteName === soundingTargetNote;
  const matchStartedAt = isCorrect ? previousMatchStartedAt ?? now : null;
  const heldLongEnough = Boolean(matchStartedAt && now - matchStartedAt >= MATCH_HOLD_MS);

  if (!isCorrect) {
    return {
      nextState: {
        ...state,
        feedback: "incorrect",
        lastDetectedNote: pitch.noteName,
        completedRound: false,
      },
      nextMatchStartedAt: null,
      nextMismatchStartedAt: null,
    };
  }

  if (!heldLongEnough) {
    return {
      nextState: {
        ...state,
        feedback: "correct",
        lastDetectedNote: pitch.noteName,
        completedRound: false,
      },
      nextMatchStartedAt: matchStartedAt,
      nextMismatchStartedAt: null,
    };
  }

  const lastToneIndex = chord.tones.length - 1;
  const completedRound = state.targetIndex === lastToneIndex;

  return {
    nextState: {
      targetIndex: completedRound ? 0 : state.targetIndex + 1,
      feedback: "correct",
      lastDetectedNote: pitch.noteName,
      completedRound,
    },
    nextMatchStartedAt: null,
    nextMismatchStartedAt: null,
  };
}
