import datetime


def calculate_xp(score: float) -> int:
    """Award XP based on favorability score (ported from gamification_engine.py)."""
    if score >= 90:
        return 50
    if score >= 80:
        return 40
    if score >= 70:
        return 30
    if score >= 60:
        return 20
    return 10


def check_streak(last_date: datetime.date | None) -> tuple[int, bool]:
    """Return (delta_days, streak_continues)."""
    today = datetime.date.today()
    if not last_date:
        return 1, True
    delta = (today - last_date).days
    if delta == 1:
        return 1, True
    if delta == 0:
        return 0, True
    return 0, False


def calculate_gold_coins(score: float, streak: int) -> int:
    coins = 0
    if score >= 80:
        coins += 5
    if score >= 90:
        coins += 5
    coins += (streak // 5) * 10
    return coins


def milestone_unlocked(domain_progress: list[dict]) -> bool:
    completed = sum(1 for item in domain_progress if item.get("status") == "completed")
    return completed >= 2
