# Sakura experience

## Intent

Conversate should feel like a **premium company-specific interview room** — calm, warm, and focused. Sakura-inspired visuals signal care and polish without distracting from practice.

## Palette

| Token | Role |
|-------|------|
| `--sakura-petal-50` | Page wash, hero background |
| `--sakura-petal-100` | Secondary surfaces |
| `--sakura-petal-300` | Petals, decorative accents |
| `--sakura-petal-500` | Eyebrow text, highlights |
| `--sakura-ivory` | Card base |
| `--sakura-plum` | Primary text, CTA fill |
| `--sakura-plum-muted` | Body copy |
| `--sakura-glass-bg` / `--sakura-glass-border` | Glass cards |
| `--ir-accent-*` | Per-company stripe on persona cards |

## Motion

- Petal float: subtle, 12s loop; **disabled** when `prefers-reduced-motion: reduce`.
- No autoplay video on landing; D-ID stream only in `/chat`.

## Components

- `PetalBackdrop` — global background (layout)
- `SakuraPageShell` — page width + padding
- `SakuraHero` — landing hero
- `InterviewRoomPanel` — chat room container
- `PremiumCTA` — primary/outline links
- Existing `GlassCard`, `PersonaBadge`, `ScoreBar` from `interview-room/`

## Do / don't

- **Do** use company accent stripes on persona cards.
- **Do** keep transcript and coaching copy readable (plum on ivory).
- **Don't** use Pinterest or unclear-license imagery.
- **Don't** add Gemini to live interview UI.
