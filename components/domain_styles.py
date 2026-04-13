# components/domain_styles.py

def get_domain_style(domain, subdomain):
    """
    Returns visual styling metadata based on the domain and subdomain.
    Used for frontend themes and character animations.
    """
    styles = {
        "Political Science": {
            "Political Philosophy": {
                "color": "#3B5998",
                "emoji": "📜",
                "background": "linear-gradient(45deg, #1c1c1c, #434343)",
                "tone": "philosophical"
            },
            "Global Politics": {
                "color": "#336699",
                "emoji": "🌍",
                "background": "linear-gradient(90deg, #005AA7, #FFFDE4)",
                "tone": "global"
            },
            "Debate Simulation": {
                "color": "#D7263D",
                "emoji": "⚔️",
                "background": "radial-gradient(circle, #111, #600)",
                "tone": "assertive"
            },
            "Satirical Persona": {
                "color": "#FFA500",
                "emoji": "🃏",
                "background": "linear-gradient(90deg, #FFB75E, #ED8F03)",
                "tone": "playful"
            },
        },
        "Business Communication": {
            "Networking": {
                "color": "#00A86B",
                "emoji": "🤝",
                "background": "linear-gradient(90deg, #56ab2f, #a8e063)",
                "tone": "friendly"
            },
            "Persuasion": {
                "color": "#FF4500",
                "emoji": "🧠",
                "background": "linear-gradient(90deg, #ff512f, #dd2476)",
                "tone": "persuasive"
            },
            "Elevator Pitches": {
                "color": "#8E44AD",
                "emoji": "🚀",
                "background": "linear-gradient(90deg, #8e2de2, #4a00e0)",
                "tone": "confident"
            },
            "Negotiation": {
                "color": "#2C3E50",
                "emoji": "💼",
                "background": "linear-gradient(to right, #2c3e50, #3498db)",
                "tone": "strategic"
            },
        }
    }

    # Milestone or fallback
    if "Milestone" in subdomain:
        return {
            "color": "#FFD700",
            "emoji": "🏆",
            "background": "radial-gradient(circle, #fffac0, #ffd700)",
            "tone": "celebration"
        }

    # Return style if found, else default
    return styles.get(domain, {}).get(subdomain, {
        "color": "#cccccc",
        "emoji": "🎯",
        "background": "linear-gradient(90deg, #d3cce3, #e9e4f0)",
        "tone": "neutral"
    })
