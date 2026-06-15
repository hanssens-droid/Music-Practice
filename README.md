# Instrument Practice App

A browser-based React practice tool for learning chord tones in real time.

## What It Does

- Select a chord such as `C Maj`, `D Min`, `G 7`, or `B Dim`.
- Select an instrument such as trumpet, alto saxophone, tenor saxophone, or clarinet.
- See the active chord, scale degrees, chord tones, and current target note.
- Start microphone listening through the Web Audio API.
- Detect the played pitch with Pitchy.
- Convert frequency to MIDI and note names.
- Compare the detected note to the expected chord tone with instrument transposition.
- Show immediate visual feedback and advance through the chord tones.

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Vite
- Web Audio API
- Pitchy

## Project Structure

```text
src/
  components/          UI components for controls, display, and feedback
  hooks/               React hooks, including microphone pitch detection
  lib/audio/           Pitch detection service
  lib/exercise/        Exercise validation and progression logic
  lib/music/           Chord and note theory utilities
  types/               Shared TypeScript types
```

## Run Locally

Install Node.js first, then run:

```bash
npm install
npm run dev
```

The microphone API requires a secure browser context. `localhost` works during development.

## Build

```bash
npm run build
```

## Deploy to GitHub Pages

1. Create a GitHub repository.
2. Push this project to the repository's `main` branch.
3. In GitHub, open `Settings` -> `Pages`.
4. Set `Source` to `GitHub Actions`.
5. Push a commit to `main`.

The included workflow builds the Vite app and publishes the `dist` folder to GitHub Pages. It automatically uses the right base path for either a normal project repository or a `username.github.io` repository.

## Notes

Pitch detection is monophonic, so it works best when the player sustains one note at a time in a quiet room. The exercise engine currently compares pitch class only, so any octave of the expected note counts as correct.
