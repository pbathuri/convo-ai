# Interview room design system

Primitives live in `src/components/ui/interview-room/`.

## Principles

- Premium coaching product — not generic chatbot UI
- Glass cards for panels; company accent dots per persona
- Readiness indicators: pending / ready / warning / error
- Score bars with green / amber / red thresholds

## Tokens

See `tokens.css` for `--ir-accent-*`, glass surfaces, score colors.

## Usage

All session cockpit, feedback, and progress surfaces import from `@/components/ui/interview-room`.
