type PracticeOptionsProps = {
  hideDegrees: boolean;
  hideNotes: boolean;
  onHideDegreesChange: (hideDegrees: boolean) => void;
  onHideNotesChange: (hideNotes: boolean) => void;
  onRandomChord: () => void;
};

export function PracticeOptions({
  hideDegrees,
  hideNotes,
  onHideDegreesChange,
  onHideNotesChange,
  onRandomChord,
}: PracticeOptionsProps) {
  return (
    <section className="grid gap-3 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <button
        className="h-11 rounded-md bg-stone-950 px-4 text-sm font-black text-white transition hover:bg-stone-800"
        onClick={onRandomChord}
        type="button"
      >
        Random chord
      </button>

      <label className="flex min-h-10 items-center justify-between gap-4 rounded-md bg-stone-50 px-3 text-sm font-bold text-stone-800">
        Hide chord notes
        <input
          checked={hideNotes}
          className="size-5 accent-emerald-700"
          onChange={(event) => onHideNotesChange(event.target.checked)}
          type="checkbox"
        />
      </label>

      <label className="flex min-h-10 items-center justify-between gap-4 rounded-md bg-stone-50 px-3 text-sm font-bold text-stone-800">
        Hide degrees
        <input
          checked={hideDegrees}
          className="size-5 accent-emerald-700"
          onChange={(event) => onHideDegreesChange(event.target.checked)}
          type="checkbox"
        />
      </label>
    </section>
  );
}
