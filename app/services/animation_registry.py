# services/animation_registry.py

def get_animation_for_subdomain(subdomain):
    animations = {
        "Political Philosophy": {
            "css_class": "slide-fade",
            "emoji": "📜"
        },
        "Global Politics": {
            "css_class": "cyber-fade",
            "emoji": "🌐"
        },
        "Debate Simulation": {
            "css_class": "bounce-text",
            "emoji": "🗣️"
        },
        "Satirical Persona": {
            "css_class": "jitter-text",
            "emoji": "🤡"
        },
        "Confidence Building": {
            "css_class": "punch-text",
            "emoji": "💪"
        },
        "Persuasive Pitching": {
            "css_class": "heartbeat",
            "emoji": "📈"
        },
        "Empathy Coaching": {
            "css_class": "calm-breeze",
            "emoji": "🫂"
        },
        "AI Ethics": {
            "css_class": "ethics-glow",
            "emoji": "⚖️"
        },
        "AI & Society": {
            "css_class": "cyber-fade",
            "emoji": "🧬"
        },
        "Sales Persuasion": {
            "css_class": "flame-warm",
            "emoji": "🔥"
        },
        "Philosophical Logic": {
            "css_class": "scroll-texture",
            "emoji": "🔍"
        }
    }

    return animations.get(subdomain, {
        "css_class": "fade-scroll",
        "emoji": "💬"
    })
