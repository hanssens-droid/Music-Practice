import type { ChordDefinition } from "../types/music";

type ChordSelectorProps = {
  chords: ChordDefinition[];
  selectedChordId: string;
  onChange: (chordId: string) => void;
};

export function ChordSelector({ chords, selectedChordId, onChange }: ChordSelectorProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-stone-700">
      Chord
      <select
        className="h-11 rounded-md border border-stone-300 bg-white px-3 text-base font-medium text-stone-950 shadow-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/15"
        value={selectedChordId}
        onChange={(event) => onChange(event.target.value)}
      >
        {chords.map((chord) => (
          <option key={chord.id} value={chord.id}>
            {chord.label}
          </option>
        ))}
      </select>
    </label>
  );
}
