import datetime

from fastapi.testclient import TestClient

from app.main import app
from app.services.gamification import calculate_xp, check_streak, milestone_unlocked

client = TestClient(app)


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["ok"] is True
    assert body["service"] == "convo-ai-backend"


def test_gamification_xp():
    assert calculate_xp(95) == 50
    assert calculate_xp(55) == 10


def test_gamification_streak():
    today = datetime.date.today()
    delta, cont = check_streak(today)
    assert delta == 0
    assert cont is True


def test_milestone():
    assert milestone_unlocked([{"status": "completed"}, {"status": "completed"}]) is True
    assert milestone_unlocked([{"status": "completed"}]) is False


def test_gamification_api():
    r = client.post("/gamification/xp", json={"score": 85})
    assert r.status_code == 200
    assert r.json()["xp"] == 40


def test_emotion_prompt_api():
    r = client.post(
        "/emotion/prompt",
        json={"user_input": "Hello team", "goal": "leadership"},
    )
    assert r.status_code == 200
    assert "confidence" in r.json()["prompt"]


def test_voice_mock():
    r = client.post("/voice/transcribe")
    assert r.status_code == 200
    assert r.json()["degraded"] is True


def test_skill_tree_api():
    r = client.get("/skill-tree")
    assert r.status_code == 200
    body = r.json()
    assert "tree" in body
    assert len(body["tree"]) >= 1


def test_memory_api():
    r = client.post(
        "/memory/update",
        json={
            "memory": [],
            "user_input": "hi",
            "ai_response": "hello",
            "score": 80,
        },
    )
    assert r.status_code == 200
    assert len(r.json()["memory"]) == 1
