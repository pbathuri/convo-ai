# components/ui_blocks.py

import streamlit as st
import matplotlib.pyplot as plt
import numpy as np
import datetime
import os


def show_score(score):
    st.markdown("### 🤝 Favorability Score")
    st.progress(score)
    st.write(f"Favorability: {score}/100")


def show_feedback(text):
    st.markdown("### 💡 Feedback")
    st.info(text)


def show_conversation_history(user_msgs, ai_msgs, scores=None, feedbacks=None):
    with st.expander("💬 Show Conversation History"):
        for i in range(len(user_msgs)):
            st.markdown(f"**You:** {user_msgs[i]}")
            st.markdown(f"**AI:** {ai_msgs[i]}")
            if scores and i < len(scores):
                st.caption(f"Favorability: {scores[i]}/100")
            if feedbacks and i < len(feedbacks):
                st.caption(f"Feedback: {feedbacks[i]}")
            st.markdown("---")


def show_progress_chart(scores):
    if scores and len(scores) > 1:
        with st.expander("📈 Show Favorability Progress Over Time"):
            st.line_chart(scores)


def show_emotion_radar(emotion_data: dict):
    labels = list(emotion_data.keys())
    if "insight" in labels:
        labels.remove("insight")
    values = [emotion_data[trait] for trait in labels]

    values += values[:1]
    labels += labels[:1]
    angles = np.linspace(0, 2 * np.pi, len(labels), endpoint=False).tolist()
    angles += angles[:1]

    fig, ax = plt.subplots(figsize=(5.5, 5.5), subplot_kw=dict(
        polar=True), facecolor="#131f24")
    ax.set_facecolor("#1c2b33")
    ax.plot(angles, values, linewidth=2.5, linestyle="solid", color="#58cc02")
    ax.fill(angles, values, alpha=0.22, color="#58cc02")
    ax.set_yticklabels([])
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(labels, fontsize=11, color="#e8eef1")
    ax.tick_params(colors="#7a8e97")
    ax.grid(color="#3c4a52", linestyle="-", linewidth=0.5)

    st.markdown("### 🧠 Emotional Radar")
    st.pyplot(fig, clear_figure=True)


def show_skill_dashboard(skills_data):
    st.markdown("## 📈 Skill Intelligence Dashboard")
    for skill, values in skills_data.items():
        if not values:
            continue
        times = [v[0] for v in values]
        scores = [v[1] for v in values]
        fig, ax = plt.subplots()
        ax.plot(times, scores, marker="o")
        ax.set_title(f"{skill.capitalize()} Over Time")
        ax.set_xlabel("Time")
        ax.set_ylabel("Score (0–10)")
        ax.grid(True)
        st.pyplot(fig)


def show_xp_streak_rewards(xp, streak, milestone_completed=False):
    st.markdown("## 🏅 Rewards & Progress")
    st.markdown(f"**🏆 XP Gained:** `{xp}`")

    # ✅ Display the static coin image if available locally
    coin_path = "assets/coin_placeholder.png"
    if os.path.exists(coin_path):
        st.image(coin_path, width=100)

    st.markdown(f"**🔥 Current Streak:** `{streak} days`")

    if milestone_completed:
        st.balloons()
        st.success("🎉 Milestone Reached!")
        st.markdown("🏅 You've unlocked a new trophy!")

    with st.expander("🔎 View Current Badges & Coins"):
        st.markdown("🥇 *Trophies:* 3")
        st.markdown("🪙 *Gold Coins:* 124")
        st.markdown("📛 *Badges:* Confident Speaker, Diplomat")
