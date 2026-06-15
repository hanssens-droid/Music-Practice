import { useEffect, useMemo, useRef, useState } from "react";
import { ChordDisplay } from "./components/ChordDisplay";
import { ChordSelector } from "./components/ChordSelector";
import { InstrumentSelector } from "./components/InstrumentSelector";
import { MicrophoneControls } from "./components/MicrophoneControls";
import { PitchFeedback } from "./components/PitchFeedback";
import { PracticeOptions } from "./components/PracticeOptions";
import { TargetNote } from "./components/TargetNote";
import { usePitchDetection } from "./hooks/usePitchDetection";
import {
  evaluatePitch,
  getTargetNote,
  MATCH_HOLD_MS,
  type ExerciseState,
} from "./lib/exercise/exerciseEngine";
import { CHORD_LIBRARY } from "./lib/music/chords";
import {
  getSoundingNote,
  getWrittenNoteFromSounding,
  INSTRUMENTS,
} from "./lib/music/instruments";

export function App() {
  const [selectedChordId, setSelectedChordId] = useState("C-major");
  const [selectedInstrumentId, setSelectedInstrumentId] = useState("trumpet");
  const [hideDegrees, setHideDegrees] = useState(false);
  const [hideNotes, setHideNotes] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [exerciseState, setExerciseState] = useState<ExerciseState>({
    targetIndex: 0,
    feedback: "idle",
  });
  const matchStartedAtRef = useRef<number | null>(null);
  const mismatchStartedAtRef = useRef<number | null>(null);
  const { error, isListening, pitch, start, stop } = usePitchDetection();

  const selectedChord = useMemo(
    () => CHORD_LIBRARY.find((chord) => chord.id === selectedChordId) ?? CHORD_LIBRARY[0],
    [selectedChordId],
  );
  const selectedInstrument = useMemo(
    () =>
      INSTRUMENTS.find((instrument) => instrument.id === selectedInstrumentId) ??
      INSTRUMENTS[0],
    [selectedInstrumentId],
  );

  const targetNote = getTargetNote(selectedChord, exerciseState.targetIndex);
  const soundingTargetNote = getSoundingNote(targetNote, selectedInstrument);
  const targetDegree = selectedChord.tones[exerciseState.targetIndex].degree;
  const writtenDetectedNote = pitch
    ? getWrittenNoteFromSounding(pitch.noteName, selectedInstrument)
    : null;

  function selectRandomChord() {
    const availableChords = CHORD_LIBRARY.filter((chord) => chord.id !== selectedChordId);
    const randomChord =
      availableChords[Math.floor(Math.random() * availableChords.length)] ?? CHORD_LIBRARY[0];

    setSelectedChordId(randomChord.id);
  }

  useEffect(() => {
    setExerciseState({ targetIndex: 0, feedback: isListening ? "listening" : "idle" });
    matchStartedAtRef.current = null;
    mismatchStartedAtRef.current = null;
    setHoldProgress(0);
  }, [selectedChordId, selectedInstrumentId, isListening]);

  useEffect(() => {
    if (!isListening) {
      return;
    }

    const now = performance.now();
    const { nextState, nextMatchStartedAt, nextMismatchStartedAt } = evaluatePitch(
      selectedChord,
      soundingTargetNote,
      exerciseState,
      pitch,
      matchStartedAtRef.current,
      mismatchStartedAtRef.current,
      now,
    );

    matchStartedAtRef.current = nextMatchStartedAt;
    mismatchStartedAtRef.current = nextMismatchStartedAt;
    setHoldProgress(
      nextMatchStartedAt ? Math.min(1, (now - nextMatchStartedAt) / MATCH_HOLD_MS) : 0,
    );
    setExerciseState((current) =>
      current.targetIndex === nextState.targetIndex &&
      current.feedback === nextState.feedback &&
      current.lastDetectedNote === nextState.lastDetectedNote
        ? current
        : nextState,
    );
  }, [exerciseState, isListening, pitch, selectedChord, soundingTargetNote]);

  return (
    <main className="min-h-screen bg-[#f6f7f1]">
      <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[1fr_390px] lg:py-8">
        <div className="grid gap-5">
          <div className="flex flex-col gap-4 border-b border-stone-300 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-emerald-800">
                Instrument Practice
              </p>
              <h2 className="mt-1 text-3xl font-black text-stone-950 sm:text-4xl">
                Chord-tone trainer
              </h2>
            </div>
            <div className="grid w-full gap-3 sm:w-auto sm:min-w-[32rem] sm:grid-cols-2">
              <InstrumentSelector
                instruments={INSTRUMENTS}
                selectedInstrumentId={selectedInstrumentId}
                onChange={setSelectedInstrumentId}
              />
              <ChordSelector
                chords={CHORD_LIBRARY}
                selectedChordId={selectedChordId}
                onChange={setSelectedChordId}
              />
            </div>
          </div>

          <ChordDisplay
            chord={selectedChord}
            hideDegrees={hideDegrees}
            hideNotes={hideNotes}
            targetIndex={exerciseState.targetIndex}
          />
          <TargetNote
            hideNote={hideNotes}
            instrumentLabel={selectedInstrument.label}
            soundingTargetNote={soundingTargetNote}
            targetDegree={targetDegree}
            targetNote={targetNote}
          />
        </div>

        <aside className="grid content-start gap-5">
          <PracticeOptions
            hideDegrees={hideDegrees}
            hideNotes={hideNotes}
            onHideDegreesChange={setHideDegrees}
            onHideNotesChange={setHideNotes}
            onRandomChord={selectRandomChord}
          />
          <MicrophoneControls
            error={error}
            isListening={isListening}
            onStart={() => {
              void start();
            }}
            onStop={stop}
          />
          <PitchFeedback
            feedback={exerciseState.feedback}
            holdProgress={holdProgress}
            hideNotes={hideNotes}
            instrumentLabel={selectedInstrument.label}
            pitch={pitch}
            soundingTargetNote={soundingTargetNote}
            targetNote={targetNote}
            writtenDetectedNote={writtenDetectedNote}
          />
        </aside>
      </div>
    </main>
  );
}
