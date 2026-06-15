import type { NoteLetter } from "../types/music";

type TargetNoteProps = {
  hideNote: boolean;
  instrumentLabel: string;
  soundingTargetNote: NoteLetter;
  targetNote: NoteLetter;
  targetDegree: string;
};

export function TargetNote({
  hideNote,
  instrumentLabel,
  soundingTargetNote,
  targetNote,
  targetDegree,
}: TargetNoteProps) {
  return (
    <section className="grid min-h-64 place-items-center rounded-lg bg-stone-950 p-6 text-center text-white shadow-sm">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-lime-300">
          Play degree {targetDegree}
        </p>
        <div className="mt-4 text-8xl font-black leading-none sm:text-9xl">
          {hideNote ? "?" : targetNote}
        </div>
        <p className="mt-5 text-sm font-bold uppercase tracking-[0.12em] text-white/65">
          {hideNote
            ? `${instrumentLabel} written note`
            : `${instrumentLabel} written note, sounds ${soundingTargetNote}`}
        </p>
      </div>
    </section>
  );
}
