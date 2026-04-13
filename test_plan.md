
# 🧪 Test Plan for Convo AI

## 🎯 Goal

Ensure that all key modules and UI features of Convo AI function as expected with high reliability, especially under conversational scenarios and UI transitions.

---

## ✅ Unit Tests

| Module                | What to Test                            |
|----------------------|------------------------------------------|
| memory_engine.py     | Memory updates, append logic             |
| emotion_engine.py    | JSON output format, trait score range    |
| scoring_engine.py    | Score between 0–100                      |
| feedback_engine.py   | Sentence generation                      |
| gamification_engine  | XP, streak, milestone logic              |
| skill_tracker        | Time series updates, skill decay         |
| skill_map.py         | Visual rendering and skill bubble config |
| app.py               | End-to-end test with mock input          |

---

## 🧪 Manual UI Testing

- ✅ Skill map scrolls and renders animated bubbles
- ✅ Voice recording works (with fallback on no mic)
- ✅ All domains + subdomains load with animated feedback
- ✅ XP & streak values update after each turn
- ✅ Timer restricts input correctly
- ✅ Transcript export works as intended

## 🧰 Tools (optional)

- pytest for unit testing
- Streamlit test runner
- Streamlit CLI for performance testing

