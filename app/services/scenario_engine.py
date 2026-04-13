# services/scenario_engine.py

import json
import os

# Default path where predefined scenarios are stored
SCENARIO_PATH = "data/scenarios.json"

def list_scenario_names():
    """
    Lists all available scenario names.
    """
    if not os.path.exists(SCENARIO_PATH):
        return []
    
    with open(SCENARIO_PATH, "r") as f:
        data = json.load(f)
    return list(data.keys())

def get_scenario(name):
    """
    Retrieves the full scenario configuration based on the name.

    Returns:
        dict: {goal, persona, traits, context}
    """
    if not os.path.exists(SCENARIO_PATH):
        return None

    with open(SCENARIO_PATH, "r") as f:
        data = json.load(f)

    return data.get(name)
