# services/ui/subdomain_visuals.py

def get_subdomain_visual(subdomain):
    visuals = {
        "Political Philosophy": {
            "bg_gradient": "linear-gradient(to right, #8e9eab, #eef2f3)",
            "tone_color": "#334455",
            "animation": "slide-fade",
            "persona_label": "📜 Historical Theorist"
        },
        "Global Politics": {
            "bg_gradient": "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
            "tone_color": "#a1c4fd",
            "animation": "cyber-fade",
            "persona_label": "🌐 Global Analyst"
        },
        "Debate Simulation": {
            "bg_gradient": "linear-gradient(to right, #373B44, #4286f4)",
            "tone_color": "#1e3c72",
            "animation": "bounce-text",
            "persona_label": "🗣️ Simulated Panel"
        },
        "Satirical Persona": {
            "bg_gradient": "linear-gradient(to right, #fc4a1a, #f7b733)",
            "tone_color": "#f77f00",
            "animation": "jitter-text",
            "persona_label": "🤡 Satirical Commentator"
        },
        "Confidence Building": {
            "bg_gradient": "linear-gradient(to right, #11998e, #38ef7d)",
            "tone_color": "#00796B",
            "animation": "punch-text",
            "persona_label": "💪 Self-Belief Coach"
        },
        "Persuasive Pitching": {
            "bg_gradient": "linear-gradient(to right, #ff416c, #ff4b2b)",
            "tone_color": "#b71c1c",
            "animation": "heartbeat",
            "persona_label": "📈 Startup Closer"
        },
        "Empathy Coaching": {
            "bg_gradient": "linear-gradient(to right, #83a4d4, #b6fbff)",
            "tone_color": "#3f51b5",
            "animation": "calm-breeze",
            "persona_label": "🫂 Active Listener"
        },
        "AI Ethics": {
            "bg_gradient": "linear-gradient(to right, #ffecd2, #fcb69f)",
            "tone_color": "#d84315",
            "animation": "ethics-glow",
            "persona_label": "⚖️ AI Ethics Advisor"
        },
        "AI & Society": {
            "bg_gradient": "linear-gradient(to right, #00c6ff, #0072ff)",
            "tone_color": "#004e92",
            "animation": "cyber-fade",
            "persona_label": "🧬 Futurist"
        },
        "Sales Persuasion": {
            "bg_gradient": "linear-gradient(to right, #ff6a00, #ee0979)",
            "tone_color": "#e65100",
            "animation": "flame-warm",
            "persona_label": "🔥 Dealmaker"
        },
        "Philosophical Logic": {
            "bg_gradient": "linear-gradient(to right, #bdc3c7, #2c3e50)",
            "tone_color": "#2c3e50",
            "animation": "scroll-texture",
            "persona_label": "🔍 Logic Mentor"
        }
    }

    return visuals.get(subdomain, {
        "bg_gradient": "linear-gradient(to right, #f7f8f8, #acbb78)",
        "tone_color": "#333333",
        "animation": "fade-scroll",
        "persona_label": "💬 Default Persona"
    })
