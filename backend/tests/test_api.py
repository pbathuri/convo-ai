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


def test_voice_transcribe_multipart():
    r = client.post(
        "/voice/transcribe",
        files={"audio": ("clip.webm", b"fake-audio", "audio/webm")},
    )
    assert r.status_code == 200
    body = r.json()
    assert body["provider"] in ("mock", "deepgram")
    assert "text" in body


def test_voice_agent_config():
    r = client.get("/voice/agent-config")
    assert r.status_code == 200
    body = r.json()
    assert "configured" in body
    assert "agent" in body


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


def test_domains_api():
    r = client.get("/domains")
    assert r.status_code == 200
    body = r.json()
    assert len(body["domains"]) == 8
    assert len(body["liveModules"]) >= 3


def test_llm_status_api():
    r = client.get("/llm/status")
    assert r.status_code == 200
    body = r.json()
    assert "chain" in body
    assert "gemini" in body


def test_domains_prompt_api():
    r = client.post(
        "/domains/prompt",
        json={
            "module": "business_communication",
            "subdomain": "Networking",
            "user_input": "I met a VP at a conference",
        },
    )
    assert r.status_code == 200
    body = r.json()
    assert "prompt" in body
    assert "Networking" in body["prompt"] or "networking" in body["prompt"].lower()
