type MicrophoneControlsProps = {
  error: string | null;
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
};

export function MicrophoneControls({
  error,
  isListening,
  onStart,
  onStop,
}: MicrophoneControlsProps) {
  return (
    <section className="grid gap-3 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <button
        className={`h-12 rounded-md px-4 text-base font-black text-white transition ${
          isListening
            ? "bg-red-700 hover:bg-red-800"
            : "bg-emerald-700 hover:bg-emerald-800"
        }`}
        onClick={isListening ? onStop : onStart}
        type="button"
      >
        {isListening ? "Stop microphone" : "Start microphone"}
      </button>
      <p className="text-sm font-medium text-stone-600">
        Use a quiet room and play one note at a time for the most stable pitch reading.
      </p>
      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-900">
          {error}
        </p>
      ) : null}
    </section>
  );
}
