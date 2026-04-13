#services/skill_tracker.py

import numpy as np
import datetime

SKILL_LIST = ["clarity", "confidence", "empathy", "listening", "persuasiveness"]

def init_skill_tracker():
    return {
        "clarity": [],
        "confidence": [],
        "empathy": [],
        "positivity": [],
        "persuasiveness": []
    }

def update_skills(tracker, new_scores):
    timestamp = datetime.datetime.now().isoformat()
    for skill, score in new_scores.items():
        if skill in tracker:
            tracker[skill].append({"value": score, "time": timestamp})
    return tracker

def get_skill_averages(tracker):
    return {
        skill: round(sum(item["value"] for item in values) / len(values), 1) if values else 0
        for skill, values in tracker.items()
    }

def get_lowest_trait(latest_scores):
    trait_scores = {k: v for k, v in latest_scores.items() if isinstance(v, (int, float))}
    return min(trait_scores, key=trait_scores.get) if trait_scores else None

def get_skill_timeseries(tracker):
    timeseries = {}
    for skill, entries in tracker.items():
        timeseries[skill] = [(entry["time"], entry["value"]) for entry in entries]
    return timeseries
