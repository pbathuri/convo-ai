
# 🧠 Convo AI

Convo AI is an interactive conversation simulation platform designed to help users practice domain-specific communication with emotionally intelligent, persona-driven AI agents. Inspired by Duolingo's UI and feedback mechanics, it combines gamification, emotional feedback, skill tracking, and realistic voice interaction into a cohesive learning experience.

## 🎯 Core Features

- 🎓 Domain Modules: Political Science, Business Communication, Debate, Philosophy, etc.
- 💬 Realistic AI personas based on goals, tone, and memory.
- 🎙️ Voice input/output (text-to-speech, speech-to-text).
- 🧠 Emotional tone evaluation and skill coaching.
- 📈 XP, streak, and skill maps inspired by Duolingo.
- 🗺️ Visual skill progression map.
- 📤 Transcript and session export.

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/convo-ai.git
cd convo-ai
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the App
```bash
streamlit run app.py
```

## 📁 Folder Structure

- `app.py` — Main application
- `components/` — UI elements (skill map, charts, dashboards)
- `services/` — All backend engines (emotion, scoring, multi-agent, etc.)
- `services/domains/` — Expert domain modules
- `data/` — Configurable JSONs like learning_progression.json
- `assets/` — Future mascot animations, visuals
- `tests/` — (Planned) Unit tests

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to get started.

## 📄 License

MIT License.
