# services/skill_tree.py

skill_tree = {
    "Political Science": {
        "icon": "\ud83d\uddf3\ufe0f",
        "color": "#4a90e2",
        "skills": [
            {
                "name": "Political Philosophy",
                "status": "unlocked",
                "xp": 60,
                "streak": 2
            },
            {
                "name": "Global Politics",
                "status": "unlocked",
                "xp": 30,
                "streak": 1
            },
            {
                "milestone": True,
                "name": "Milestone 1",
                "status": "milestone",
                "xp_required": 90,
                "challenge": "Apply political theories to current events."
            },
            {
                "name": "Debate Simulation",
                "status": "locked",
                "xp": 0,
                "streak": 0
            },
            {
                "name": "Satirical Persona",
                "status": "locked",
                "xp": 0,
                "streak": 0
            }
        ]
    },
    "Business Communication": {
        "icon": "\ud83d\udcbc",
        "color": "#28a745",
        "skills": [
            {
                "name": "Networking",
                "status": "unlocked",
                "xp": 50,
                "streak": 3
            },
            {
                "name": "Persuasion",
                "status": "unlocked",
                "xp": 40,
                "streak": 2
            },
            {
                "milestone": True,
                "name": "Milestone 1",
                "status": "milestone",
                "xp_required": 80,
                "challenge": "Demonstrate persuasive techniques in a mock pitch."
            },
            {
                "name": "Elevator Pitches",
                "status": "locked",
                "xp": 0,
                "streak": 0
            },
            {
                "name": "Negotiation",
                "status": "locked",
                "xp": 0,
                "streak": 0
            }
        ]
    }
}
