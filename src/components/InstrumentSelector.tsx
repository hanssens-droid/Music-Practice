import type { InstrumentDefinition } from "../types/music";

type InstrumentSelectorProps = {
  instruments: InstrumentDefinition[];
  selectedInstrumentId: string;
  onChange: (instrumentId: string) => void;
};

export function InstrumentSelector({
  instruments,
  selectedInstrumentId,
  onChange,
}: InstrumentSelectorProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-stone-700">
      Instrument
      <select
        className="h-11 rounded-md border border-stone-300 bg-white px-3 text-base font-medium text-stone-950 shadow-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/15"
        value={selectedInstrumentId}
        onChange={(event) => onChange(event.target.value)}
      >
        {instruments.map((instrument) => (
          <option key={instrument.id} value={instrument.id}>
            {instrument.label}
          </option>
        ))}
      </select>
    </label>
  );
}
