# components/skill_map.py

import streamlit as st
from services.skill_tree import skill_tree

def render_bubble_html(skill):
    base_class = "skill-bubble"
    if skill.get("milestone"):
        base_class += " milestone"

    # Emoji selection
    emoji = "🔒" if skill.get("status") == "locked" else "🟢"
    if skill.get("status") == "milestone":
        emoji = "🏆"

    # XP and streak display
    xp_html = f"<div class='meta'>XP: {skill.get('xp', 0)}</div>" if "xp" in skill else ""
    streak_html = f"<div class='meta streak'>🔥 {skill.get('streak', 0)}</div>" if "streak" in skill else ""
    desc_html = f"<div class='desc'>{skill.get('challenge', '')}</div>" if skill.get("status") == "milestone" else ""

    html = (
        f"<div class='{base_class}'>"
        f"<div class='bubble-content'>"
        f"<div class='emoji'>{emoji}</div>"
        f"<div class='name'>{skill['name']}</div>"
        f"{xp_html}"
        f"{streak_html}"
        f"{desc_html}"
        f"</div></div>"
    )
    return html

def show_skill_map():
    st.markdown("""
    <style>
        .skill-map-container {
            height: 600px;
            overflow-y: auto;
            padding: 20px;
            background: linear-gradient(to bottom, #fefcea, #f1da36);
            border-radius: 10px;
            position: relative;
        }
        .skill-bubble {
            width: 120px;
            height: 120px;
            border-radius: 60px;
            background-color: #ffffff;
            border: 4px solid #4a90e2;
            text-align: center;
            font-size: 0.9rem;
            font-weight: bold;
            box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
            margin: 30px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s ease;
        }
        .skill-bubble:hover {
            transform: scale(1.05);
            box-shadow: 0 0 12px rgba(74, 144, 226, 0.4);
        }
        .milestone {
            border: 4px dashed gold;
            background-color: #fffbe6;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.5); }
            70% { box-shadow: 0 0 0 10px rgba(255, 215, 0, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0); }
        }
        .bubble-content {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .bubble-content .emoji {
            font-size: 1.6rem;
            margin-bottom: 4px;
        }
        .bubble-content .name {
            font-size: 0.85rem;
            font-weight: bold;
            margin-bottom: 4px;
        }
        .bubble-content .meta {
            font-size: 0.7rem;
            color: #555;
        }
        .bubble-content .meta.streak {
            color: #dd9933;
            font-weight: 600;
        }
        .bubble-content .desc {
            font-size: 0.7rem;
            font-style: italic;
            margin-top: 4px;
            color: #777;
        }
    </style>
    """, unsafe_allow_html=True)

    st.markdown("## 🗺️ Skill Map Progression")

    for domain, data in skill_tree.items():
        emoji_icon = data['icon'].encode("utf-16", "surrogatepass").decode("utf-16")
        st.markdown("### {} {}".format(emoji_icon, domain))
        st.markdown('<div class="skill-map-container">', unsafe_allow_html=True)

        for skill in data["skills"]:
            st.markdown(render_bubble_html(skill), unsafe_allow_html=True)

        st.markdown('</div>', unsafe_allow_html=True)
