# services/gamification_engine.py

import datetime

def calculate_xp(score):
    """
    Award XP based on favorability score.
    Higher scores yield more XP.
    """
    if score >= 90:
        return 50
    elif score >= 80:
        return 40
    elif score >= 70:
        return 30
    elif score >= 60:
        return 20
    else:
        return 10


def check_streak(last_date):
    """
    Evaluate if streak continues based on last usage.
    """
    today = datetime.date.today()
    if not last_date:
        return 1, True

    delta = (today - last_date).days
    if delta == 1:
        return 1, True  # Streak continues
    elif delta == 0:
        return 0, True  # Already used today
    else:
        return 0, False  # Streak broken


def calculate_gold_coins(score, streak):
    """
    Award coins based on streak strength and high score
    """
    coins = 0
    if score >= 80:
        coins += 5
    if score >= 90:
        coins += 5
    coins += streak // 5 * 10  # Every 5-day streak gives bonus coins
    return coins


def milestone_unlocked(domain_progress):
    """
    Unlocks milestone after 2 or more subdomains completed.
    """
    completed = sum(1 for item in domain_progress if item.get("status") == "completed")
    return completed >= 2
