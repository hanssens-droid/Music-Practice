import type { ChordDefinition, NoteLetter } from "../types/music";
import { getChordNotes } from "../lib/music/chords";

type ChordDisplayProps = {
  chord: ChordDefinition;
  hideDegrees: boolean;
  hideNotes: boolean;
  targetIndex: number;
};

export function ChordDisplay({
  chord,
  hideDegrees,
  hideNotes,
  targetIndex,
}: ChordDisplayProps) {
  const notes: NoteLetter[] = getChordNotes(chord);

  return (
    <section className="grid gap-6 rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-700">
          Current chord
        </p>
        <h1 className="mt-2 text-5xl font-black leading-none text-stone-950 sm:text-7xl">
          {chord.label}
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {chord.tones.map((tone, index) => {
          const active = index === targetIndex;
          const completed = index < targetIndex;

          return (
            <div
              className={`min-h-28 rounded-md border p-4 transition ${
                active
                  ? "border-emerald-700 bg-emerald-50 text-emerald-950 shadow-sm"
                  : completed
                    ? "border-lime-400 bg-lime-50 text-lime-950"
                    : "border-stone-200 bg-stone-50 text-stone-600"
              }`}
              key={`${tone.degree}-${tone.semitones}`}
            >
              <div className="text-sm font-bold uppercase text-current/70">Degree</div>
              <div className="mt-1 text-3xl font-black">{hideDegrees ? "?" : tone.degree}</div>
              <div className="mt-3 text-lg font-bold">{hideNotes ? "--" : notes[index]}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
