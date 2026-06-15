import type { DetectedPitch, FeedbackState, NoteLetter } from "../types/music";

type PitchFeedbackProps = {
  feedback: FeedbackState;
  hideNotes: boolean;
  holdProgress: number;
  instrumentLabel: string;
  pitch: DetectedPitch | null;
  soundingTargetNote: NoteLetter;
  targetNote: NoteLetter;
  writtenDetectedNote: NoteLetter | null;
};

const FEEDBACK_COPY: Record<FeedbackState, { title: string; detail: string; classes: string }> = {
  idle: {
    title: "Ready",
    detail: "Start the microphone when your instrument is in playing position.",
    classes: "border-stone-200 bg-white text-stone-800",
  },
  listening: {
    title: "Listening",
    detail: "Hold the note steady so the tuner can lock in.",
    classes: "border-sky-300 bg-sky-50 text-sky-950",
  },
  correct: {
    title: "Correct",
    detail: "Nice. Keep it centered for the next chord tone.",
    classes: "border-emerald-400 bg-emerald-50 text-emerald-950",
  },
  incorrect: {
    title: "Try again",
    detail: "Adjust toward the target note.",
    classes: "border-red-300 bg-red-50 text-red-950",
  },
};

export function PitchFeedback({
  feedback,
  hideNotes,
  holdProgress,
  instrumentLabel,
  pitch,
  soundingTargetNote,
  targetNote,
  writtenDetectedNote,
}: PitchFeedbackProps) {
  const copy = FEEDBACK_COPY[feedback];
  const displayPitch = pitch && pitch.clarity >= 0.78 ? pitch : null;
  const cents = displayPitch ? Math.round(displayPitch.centsOff) : 0;
  const needleRotation = Math.max(-45, Math.min(45, cents)) * 1.4;
  const isHoldingCorrectNote = holdProgress > 0;
  const meterGlow = Math.round(holdProgress * 18);
  const meterStyle = {
    backgroundColor: isHoldingCorrectNote
      ? `rgba(16, 185, 129, ${0.1 + holdProgress * 0.22})`
      : undefined,
    borderColor: isHoldingCorrectNote
      ? `rgba(5, 150, 105, ${0.35 + holdProgress * 0.55})`
      : undefined,
    boxShadow: isHoldingCorrectNote
      ? `0 0 0 ${meterGlow}px rgba(16, 185, 129, ${0.08 + holdProgress * 0.12})`
      : undefined,
  };

  return (
    <section className={`grid gap-5 rounded-lg border p-5 shadow-sm ${copy.classes}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.12em] opacity-70">Feedback</p>
          <h2 className="mt-1 text-3xl font-black">{copy.title}</h2>
          <p className="mt-1 text-sm font-medium opacity-80">{copy.detail}</p>
        </div>
        <div className="grid size-12 shrink-0 place-items-center rounded-full bg-current/10 text-2xl font-black">
          {feedback === "correct" ? "OK" : feedback === "incorrect" ? "!" : "~"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-md bg-white/70 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] opacity-60">Detected</p>
          <p className="mt-1 text-3xl font-black">
            {hideNotes ? "--" : displayPitch?.noteWithOctave ?? "--"}
          </p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] opacity-60">
            {hideNotes || !writtenDetectedNote
              ? "Written --"
              : `${instrumentLabel} ${writtenDetectedNote}`}
          </p>
        </div>
        <div className="rounded-md bg-white/70 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] opacity-60">Written target</p>
          <p className="mt-1 text-3xl font-black">{hideNotes ? "--" : targetNote}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] opacity-60">
            {hideNotes ? "Sounds --" : `Sounds ${soundingTargetNote}`}
          </p>
        </div>
      </div>

      <div
        className="rounded-md border-2 border-transparent bg-white/70 p-4 transition-all duration-150"
        style={meterStyle}
      >
        <div className="mb-3 flex min-h-4 items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.12em] opacity-70">
          <span>{isHoldingCorrectNote ? "Hold steady" : "Pitch center"}</span>
          <span>{isHoldingCorrectNote ? `${Math.round(holdProgress * 100)}%` : ""}</span>
        </div>
        <div className="relative mx-auto h-20 max-w-sm overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-10 rounded-t-full border-x-4 border-t-4 border-current/20" />
          <div className="absolute bottom-0 left-1/2 h-16 w-1 -translate-x-1/2 bg-current/20" />
          <div
            className="meter-needle absolute bottom-0 left-1/2 h-16 w-1 -translate-x-1/2 rounded-full bg-current"
            style={{ transform: `translateX(-50%) rotate(${needleRotation}deg)` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs font-bold uppercase tracking-[0.12em] opacity-60">
          <span>Flat</span>
          <span>{displayPitch ? `${cents > 0 ? "+" : ""}${cents} cents` : "No pitch"}</span>
          <span>Sharp</span>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-current/10">
          <div
            className="h-full rounded-full bg-emerald-600 transition-[width] duration-150"
            style={{ width: `${Math.round(holdProgress * 100)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
