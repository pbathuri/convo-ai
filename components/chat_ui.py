"""
Main conversation UI (post-onboarding) for Convo AI — Duolingo-inspired dark shell.
"""

from __future__ import annotations

import html
import json
import re
import time
import datetime
from importlib import import_module

import streamlit as st
from openai import OpenAI

from components.onboarding import DOMAIN_MODULES, load_mascot_svg
from components.ui_blocks import (
    show_skill_dashboard,
    show_emotion_radar,
    show_conversation_history,
)
from components.skill_map import show_skill_map
from components.domain_styles import get_domain_style
from services.animation_registry import get_animation_for_subdomain
from services.ui.subdomain_visuals import get_subdomain_visual
from services.feedback_engine import build_feedback_prompt
from services.scoring_engine import build_score_prompt
from services.interruption_engine import get_interruption_behavior
from services.personality_evolution import evaluate_user_tone
from services.multi_agent_engine import get_panel, MULTI_PANEL
from services.emotion_engine import evaluate_emotional_tone
from services.memory_engine import update_memory, get_memory_context
from services.skill_tracker import (
    get_lowest_trait,
    get_skill_averages,
    update_skills,
    get_skill_timeseries,
)
from services.gamification_engine import calculate_xp, check_streak
from services.voice_engine import record_and_transcribe
from services.voice_player import speak

CHAT_CSS = """
<style>
.chat-app body, .chat-app .stApp, .chat-app [data-testid="stAppViewContainer"] {
    background-color: #131F24 !important;
}
[data-testid="stSidebar"] { display: none !important; }
.chat-block-container .block-container {
    background-color: #131F24 !important;
    padding-top: 0.5rem !important;
    max-width: 1400px !important;
}
.chat-topbar {
    position: sticky; top: 0; z-index: 100;
    background: #131F24; border-bottom: 1px solid #3C4A52;
    padding: 10px 0; margin: 0 -1rem 12px;
}
.chat-top-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
.pill-badge {
    background: #1C2B33; border: 1px solid #3C4A52; border-radius: 20px;
    padding: 4px 12px; font-size: 14px; color: #E8EEF1;
}
.daily-bar-wrap { margin: 8px 0 16px; }
.daily-bar-label { display: flex; justify-content: space-between; color: #7A8E97; font-size: 13px; margin-bottom: 6px; }
.daily-bar-track { height: 12px; background: #2B3D45; border-radius: 6px; overflow: hidden; }
.daily-bar-fill { height: 12px; background: #58CC02; border-radius: 6px; }
.chip-row { display: flex; flex-wrap: nowrap; gap: 8px; overflow-x: auto; padding: 8px 0 16px; }
.chip {
    flex-shrink: 0; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;
    border: 1px solid #3C4A52; cursor: pointer;
}
.chip-off { background: #1C2B33; color: #7A8E97; }
.chip-on { background: #58CC02; color: white; border-color: #58CC02; }
.chat-scroll { max-height: 48vh; overflow-y: auto; padding: 8px 0 120px; }
.msg-row { display: flex; margin-bottom: 12px; align-items: flex-end; gap: 8px; }
.msg-row.user { justify-content: flex-end; }
.bubble-ai {
    background: #1C2B33; color: #fff; border-radius: 18px 18px 18px 4px;
    padding: 12px 16px; max-width: 78%; font-size: 15px; line-height: 1.5;
}
.bubble-user {
    background: #0A5C44; color: #fff; border-radius: 18px 18px 4px 18px;
    padding: 12px 16px; max-width: 78%; font-size: 15px; line-height: 1.5;
}
.typing-dots { color: #7A8E97; padding: 8px 12px; }
.typing-dots span { animation: chat-pulse 1s ease-in-out infinite; opacity: 0.4; }
.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes chat-pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
.chat-input-bar {
    position: sticky; bottom: 0; background: #1C2B33; border-top: 1px solid #3C4A52;
    padding: 12px 0; margin: 0 -1rem; padding-left: 1rem; padding-right: 1rem;
}
.coach-callout {
    background: rgba(88, 204, 2, 0.15); border: 1px solid #58CC02; border-radius: 12px;
    padding: 12px; color: #E8EEF1; margin-top: 8px;
}
.toast-xp {
    position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
    background: #58CC02; color: white; padding: 10px 24px; border-radius: 24px;
    font-weight: 700; z-index: 1000; animation: toast-in 0.4s ease;
}
@keyframes toast-in { from { transform: translateX(-50%) translateY(40px); opacity: 0; } to { opacity: 1; } }
</style>
"""

DOMAIN_EMOJI = {
    "Political Science": "\U0001f3db\ufe0f",
    "Business Communication": "\U0001f4bc",
    "Philosophy": "\U0001f989",
    "Emotional Intelligence": "\U0001f49a",
    "Debate Simulation": "\u2694\ufe0f",
    "Satirical Political Commentary": "\U0001f3ad",
    "Artificial Intelligence & Society": "\U0001f916",
    "Sales Talk": "\U0001f4ca",
}


def _inject_chat_css() -> None:
    st.markdown(f'<div class="chat-app chat-block-container">',
                unsafe_allow_html=True)
    st.markdown(CHAT_CSS, unsafe_allow_html=True)


def _practice_goal_to_goal() -> None:
    pg = st.session_state.get("practice_goal")
    if pg and not st.session_state.get("goal"):
        st.session_state["goal"] = f"Improve communication ({pg})"


def render_chat(
    client: OpenAI,
    *,
    chat_model: str,
    llm_provider: str = "openai",
) -> None:
    _inject_chat_css()
    _practice_goal_to_goal()

    selected_domain = st.session_state["selected_domain"]
    domain_module = import_module(DOMAIN_MODULES[selected_domain])
    subdomains = domain_module.get_subdomains()
    if not st.session_state.get("selected_subdomain") and subdomains:
        st.session_state["selected_subdomain"] = subdomains[0]
    selected_subdomain = st.session_state["selected_subdomain"]

    style_data = get_domain_style(selected_domain, selected_subdomain)
    animation = get_animation_for_subdomain(selected_subdomain)
    visual_config = get_subdomain_visual(selected_subdomain)

    # --- Top bar ---
    timer = st.session_state.conversation_timer
    start, end = timer.get("start_time"), timer.get("end_time")
    timer_text = ""
    if start and end:
        rem = int(end - time.time())
        timer_text = f"{max(0, rem) // 60}:{max(0, rem) % 60:02d}" if rem > 0 else "0:00"
    elif start and not end:
        timer_text = "\u221e"

    domain_emoji = DOMAIN_EMOJI.get(
        selected_domain, style_data.get("emoji", "\U0001f4ac"))

    prov_label = (llm_provider or "openai").upper()
    model_label = chat_model or "—"
    st.markdown(
        f'<div class="chat-topbar"><div class="chat-top-inner">'
        f'<div><strong style="color:#58CC02;font-size:18px;">Convo AI</strong> '
        f'<span class="pill-badge">{domain_emoji} {selected_domain}</span>'
        f'<span class="pill-badge">{prov_label} \u00b7 {model_label}</span></div>'
        f'<div><span class="pill-badge">\u23f1 {timer_text or "—"}</span></div>'
        f'<div style="display:flex;gap:8px;">'
        f'<span class="pill-badge">\U0001f3c6 {st.session_state.xp} XP</span>'
        f'<span class="pill-badge">\U0001f525 {st.session_state.streak}</span>'
        f"</div></div></div>",
        unsafe_allow_html=True,
    )

    dg = max(1, int(st.session_state.get("daily_goal") or 5))
    dp = int(st.session_state.get("daily_progress") or 0)
    fill_pct = min(100, int(100 * dp / dg))
    st.markdown(
        f'<div class="daily-bar-wrap">'
        f'<div class="daily-bar-label"><span>{dp}/{dg} conversations</span><span>Daily goal</span></div>'
        f'<div class="daily-bar-track"><div class="daily-bar-fill" style="width:{fill_pct}%;"></div></div>'
        f"</div>",
        unsafe_allow_html=True,
    )

    with st.expander("LLM (env: USE_OLLAMA / OPENAI_API_KEY)", expanded=False):
        st.caption(
            f"Active: **{prov_label}** — model **{model_label}**. "
            "Change via `.env` (see `.env.example`) and restart the app."
        )

    with st.expander("\u23f1 Session timer", expanded=False):
        time_limit_options = {"1 min": 60, "3 min": 180,
                              "5 min": 300, "10 min": 600, "Unlimited": None}
        sel = st.selectbox("Limit", list(
            time_limit_options.keys()), key="timer_limit_sel")
        st.session_state.conversation_timer["time_limit_seconds"] = time_limit_options[sel]
        if st.button("\u25b6 Start timer", key="timer_start"):
            st.session_state.conversation_timer["start_time"] = time.time()
            lim = st.session_state.conversation_timer["time_limit_seconds"]
            if lim:
                st.session_state.conversation_timer["end_time"] = (
                    st.session_state.conversation_timer["start_time"] + lim
                )
            else:
                st.session_state.conversation_timer["end_time"] = None
            st.rerun()

    # Subdomain chips
    if not subdomains:
        st.error("No subdomains for this domain.")
        st.stop()
    chip_cols = st.columns(len(subdomains))
    for i, sd in enumerate(subdomains):
        with chip_cols[i]:
            is_on = sd == selected_subdomain
            if st.button(sd, key=f"chip_{sd}", type="primary" if is_on else "secondary"):
                st.session_state["selected_subdomain"] = sd
                st.rerun()

    st.markdown(
        f'<div class="{visual_config["animation"]}" style="padding:10px 14px;border-radius:12px;'
        f'background:{visual_config["bg_gradient"]};color:white;font-size:14px;margin-bottom:12px;">'
        f'<b>{visual_config["persona_label"]}</b> \u2014 {selected_subdomain}</div>',
        unsafe_allow_html=True,
    )

    # Timer expiry (same behavior as original app)
    if start and end:
        now = time.time()
        if now >= end:
            st.session_state.conversation_timer["expired"] = True
            st.error("\u23f0 Time's up!")
            st.stop()

    main_col, side_col = st.columns([1.65, 1.0])

    with main_col:
        reflection = st.session_state.pop("_daily_reflection", None)
        if reflection:
            st.markdown("### \U0001f31f Daily reflection")
            st.info(reflection)
        streak_msg = st.session_state.pop("_streak_msg", None)
        if streak_msg:
            st.success(streak_msg)

        # Chat transcript
        msgs = st.session_state.get("chat_messages") or []
        st.markdown('<div class="chat-scroll">', unsafe_allow_html=True)
        mascot_small = load_mascot_svg().replace(
            'width="80"', 'width="24"').replace('height="80"', 'height="24"')
        for m in msgs:
            safe = html.escape(m.get("content", "")).replace("\n", "<br/>")
            if m.get("role") == "user":
                st.markdown(
                    f'<div class="msg-row user"><div class="bubble-user">{safe}</div></div>',
                    unsafe_allow_html=True,
                )
            else:
                st.markdown(
                    f'<div class="msg-row">'
                    f'<div style="width:28px;flex-shrink:0;">{mascot_small}</div>'
                    f'<div class="bubble-ai">{safe}</div></div>',
                    unsafe_allow_html=True,
                )
        st.markdown("</div>", unsafe_allow_html=True)

        use_panel = st.session_state.get("use_multi_panel", False)
        st.session_state["use_multi_panel"] = st.toggle(
            "\U0001f465 Panel", value=use_panel, key="panel_toggle")
        panel_data = []
        if st.session_state["use_multi_panel"]:
            panel_name = st.selectbox("Panel", list(
                MULTI_PANEL.keys()), key="panel_select")
            panel_data = get_panel(panel_name)

        st.markdown("#### \U0001f3a4 Voice")
        uploaded_audio = st.file_uploader(
            "Audio (wav/mp3/ogg)", type=["wav", "mp3", "ogg"], key="voice_up")
        user_input = ""
        if uploaded_audio:
            try:
                user_input = record_and_transcribe(uploaded_audio)
                st.caption(f"Transcribed: {user_input}")
            except Exception as e:
                st.error(str(e))
        if not user_input:
            user_input = st.text_input(
                "Message", placeholder="Type your message...", key="chat_text", label_visibility="collapsed")

        send = st.button("\u27a4 Send", type="primary", key="send_btn")

        if send and user_input.strip():
            st.session_state.setdefault("chat_messages", []).append(
                {"role": "user", "content": user_input.strip(), "ts": time.time()}
            )
            _run_turn(
                client,
                chat_model,
                domain_module,
                selected_subdomain,
                user_input.strip(),
                animation,
                panel_data,
                st.session_state["use_multi_panel"],
            )
            st.rerun()

    with side_col:
        last_em = st.session_state.get("last_emotion_data")
        if last_em:
            show_emotion_radar(last_em)
        last_score = None
        if st.session_state.get("favorability_scores"):
            last_score = st.session_state.favorability_scores[-1]
            st.markdown(f"**Latest score:** {last_score}/100")
        tip = st.session_state.get("last_coaching_tip")
        if tip:
            st.markdown(
                f'<div class="coach-callout">\U0001f3af {tip}</div>', unsafe_allow_html=True)
        lf = st.session_state.get("last_feedback_sentence")
        if lf:
            st.caption(f"Latest feedback: {lf}")
        with st.expander("\U0001f4ac Feedback history"):
            show_conversation_history(
                st.session_state.conversation_turns,
                st.session_state.ai_responses,
                st.session_state.favorability_scores,
                st.session_state.feedback_history,
            )
        with st.expander("\U0001f5fa\ufe0f Skill map"):
            show_skill_map()

    # Bottom toast (XP from last turn — cleared next interaction via rerun consumption)
    toast_xp = st.session_state.pop("_toast_xp", None)
    toast_coach = st.session_state.pop("_toast_coach", None)
    if toast_xp is not None:
        st.markdown(
            f'<div class="toast-xp">+{toast_xp} XP</div>',
            unsafe_allow_html=True,
        )
    if toast_coach:
        st.info(toast_coach)

    st.markdown("---")
    try:
        import matplotlib.pyplot as plt

        scores = st.session_state.favorability_scores
        if scores:
            fig, ax = plt.subplots(figsize=(4, 2))
            ax.plot(range(1, len(scores) + 1), scores, marker="o")
            ax.set_xlabel("Turn")
            ax.set_ylabel("Score")
            st.pyplot(fig)
    except Exception:
        pass

    st.markdown("### \U0001f9e0 Skill summary")
    timeseries = get_skill_timeseries(st.session_state.skills)
    show_skill_dashboard(timeseries)

    ec1, ec2, ec3 = st.columns(3)
    with ec1:
        export_text = "Convo AI Session Transcript\n\n"
        for i in range(len(st.session_state.conversation_turns)):
            export_text += f"User: {st.session_state.conversation_turns[i]}\n"
            export_text += f"AI: {st.session_state.ai_responses[i]}\n"
            if i < len(st.session_state.favorability_scores):
                export_text += f"Favorability: {st.session_state.favorability_scores[i]}/100\n"
            export_text += "------\n"
        st.download_button(
            "\U0001f4e4 Download transcript",
            data=export_text.encode("utf-8"),
            file_name="convo_ai_export.txt",
            mime="text/plain",
            key="dl_transcript",
            disabled=len(st.session_state.conversation_turns) == 0,
        )
    with ec2:
        if st.button("\U0001f501 Replay voice") and st.session_state.get("last_spoken_text"):
            speak(st.session_state.last_spoken_text)
    with ec3:
        if st.button("\U0001f504 Reset chat"):
            _reset_conversation_only()
            st.rerun()

    st.markdown("</div>", unsafe_allow_html=True)


def _reset_conversation_only() -> None:
    keys_reset = [
        "memory",
        "conversation_turns",
        "ai_responses",
        "feedback_history",
        "favorability_scores",
        "favorability_streak",
        "last_spoken_text",
        "reflection_shown",
        "chat_messages",
        "last_emotion_data",
        "last_coaching_tip",
        "last_feedback_sentence",
        "_toast_xp",
        "_toast_coach",
        "_awaiting_ai",
        "_daily_reflection",
    ]
    for k in keys_reset:
        if k in st.session_state:
            del st.session_state[k]
    st.session_state["memory"] = []
    st.session_state["conversation_turns"] = []
    st.session_state["ai_responses"] = []
    st.session_state["feedback_history"] = []
    st.session_state["favorability_scores"] = []
    st.session_state["favorability_streak"] = 0
    st.session_state["last_spoken_text"] = ""
    st.session_state["chat_messages"] = []
    st.session_state["conversation_timer"] = {
        "start_time": None,
        "end_time": None,
        "time_limit_seconds": st.session_state.get("conversation_timer", {}).get("time_limit_seconds"),
        "expired": False,
    }


def _run_turn(
    client: OpenAI,
    chat_model: str,
    domain_module,
    selected_subdomain: str,
    user_input: str,
    animation: dict,
    panel_data: list,
    use_panel: bool,
) -> None:
    memory_context = ""
    turns = st.session_state.conversation_turns
    responses = st.session_state.ai_responses
    for i in range(max(0, len(turns) - 3), len(turns)):
        memory_context += f"User: {turns[i]}\n"
        memory_context += f"AI: {responses[i]}\n"

    interrupt_note = get_interruption_behavior(len(user_input.split()))
    tone_observation = evaluate_user_tone(user_input)

    combined_context = memory_context
    if st.session_state.scenario_context:
        combined_context += f"\n\nScenario context: {st.session_state.scenario_context}"
    if interrupt_note:
        combined_context += f"\n\nAI Behavior Rule: {interrupt_note}"
    if tone_observation:
        combined_context += f"\n\nRecent User Tone: {tone_observation}"

    get_memory_context(st.session_state.memory)

    domain_prompt = domain_module.generate_prompt(
        user_input=user_input,
        subdomain=selected_subdomain,
        goal=st.session_state.goal,
        memory=combined_context,
        traits=st.session_state.selected_traits,
    )
    system_prompt = domain_prompt["prompt"] if isinstance(
        domain_prompt, dict) else domain_prompt

    agent_responses = []
    ai_msg = ""

    try:
        if interrupt_note:
            st.caption(f"\U0001f5ef AI may interrupt: {interrupt_note}")
        if tone_observation:
            st.caption(f"\U0001f9e0 AI will adapt: {tone_observation}")
        if panel_data:
            for agent in panel_data:
                agent_prompt = f"""
You are {agent['name']} speaking in a panel simulation.
Your tone is {agent['tone']}.
Your role: {agent['role']}
The user is trying to: {st.session_state.goal}
Context: {combined_context}
Respond naturally to:
\"{user_input}\"
"""
                response = client.chat.completions.create(
                    model=chat_model,
                    messages=[{"role": "system", "content": agent_prompt}],
                )
                ai_msg = response.choices[0].message.content
                agent_responses.append((agent["name"], ai_msg))
        else:
            response = client.chat.completions.create(
                model=chat_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_input},
                ],
            )
            ai_msg = response.choices[0].message.content
            agent_responses.append(("AI", ai_msg))

        st.session_state.last_spoken_text = ai_msg
        try:
            speak(ai_msg)
        except Exception as e:
            st.warning(f"TTS: {e}")

        full_response = ""
        display_parts = []
        for name, msg in agent_responses:
            display_parts.append(f"**{name}:** {msg}")
            full_response += f"{name}: {msg}\n"

        st.session_state.ai_responses.append(full_response)
        combined_display = "\n\n".join(display_parts)
        st.session_state.setdefault("chat_messages", []).append(
            {"role": "ai", "content": combined_display, "ts": time.time()}
        )

        emotion_prompt = evaluate_emotional_tone(
            user_input, st.session_state.goal)
        emotion_response = client.chat.completions.create(
            model=chat_model,
            messages=[
                {"role": "system", "content": "You are a communication analyst."},
                {"role": "user", "content": emotion_prompt},
            ],
        )
        raw_emotion_output = emotion_response.choices[0].message.content.strip(
        )
        try:
            emotion_data = json.loads(raw_emotion_output)
        except json.JSONDecodeError:
            json_match = re.search(r"\{.*\}", raw_emotion_output, re.DOTALL)
            if json_match:
                emotion_data = json.loads(json_match.group())
            else:
                emotion_data = {
                    "clarity": 5,
                    "confidence": 5,
                    "empathy": 5,
                    "positivity": 5,
                    "assertiveness": 5,
                    "insight": "No insight available.",
                }

        st.session_state["last_emotion_data"] = emotion_data
        skill_scores = {
            "clarity": emotion_data.get("clarity", 0),
            "confidence": emotion_data.get("confidence", 0),
            "empathy": emotion_data.get("empathy", 0),
            "positivity": emotion_data.get("positivity", 0),
            "persuasiveness": emotion_data.get("assertiveness", 0),
        }

        lowest_trait = get_lowest_trait(emotion_data)
        coaching_tip = ""
        if lowest_trait:
            coaching_prompt = f"""You are a communication coach. The user is trying to improve their '{lowest_trait}'.

Their last message was:
\"{user_input}\"

Give 1 powerful but concise sentence to help them improve their {lowest_trait}.
"""
            coaching_response = client.chat.completions.create(
                model=chat_model,
                messages=[
                    {"role": "system",
                        "content": "Only return one clear sentence of advice."},
                    {"role": "user", "content": coaching_prompt},
                ],
            )
            coaching_tip = coaching_response.choices[0].message.content.strip()
            st.session_state["last_coaching_tip"] = coaching_tip

        st.session_state.skills = update_skills(
            st.session_state.skills, skill_scores)

        score_prompt = build_score_prompt(
            st.session_state.goal, user_input, scoring_mode="basic")
        score_response = client.chat.completions.create(
            model=chat_model,
            messages=[
                {"role": "system",
                    "content": "Respond only with a number between 0 and 100."},
                {"role": "user", "content": score_prompt},
            ],
        )
        try:
            score = int(score_response.choices[0].message.content.strip())
            score = max(0, min(100, score))
        except Exception:
            score = 50

        st.session_state.favorability_scores.append(score)
        st.session_state.conversation_turns.append(user_input)

        if not st.session_state.daily_completed:
            st.session_state.daily_progress += 1
            if st.session_state.daily_progress >= st.session_state.daily_goal:
                st.session_state.daily_completed = True
                st.balloons()

        gained_xp = calculate_xp(score)
        st.session_state.xp += gained_xp
        st.session_state["_toast_xp"] = gained_xp
        if coaching_tip:
            st.session_state["_toast_coach"] = coaching_tip

        today = datetime.date.today()
        if st.session_state.last_used != today:
            streak_result, valid = check_streak(st.session_state.last_used)
            st.session_state.streak = st.session_state.streak + streak_result if valid else 1
            st.session_state.last_used = today

        if score >= 80:
            st.session_state.favorability_streak += 1
        else:
            st.session_state.favorability_streak = 0

        if st.session_state.favorability_streak >= 3:
            st.session_state["_streak_msg"] = "Goal Achieved! You're consistently hitting the right notes!"

        if st.session_state.daily_completed and "reflection_shown" not in st.session_state:
            st.session_state.reflection_shown = True
            skill_averages = get_skill_averages(st.session_state.skills)
            from services.reflection_engine import generate_reflection

            reflection_prompt = generate_reflection(
                tone_observation if tone_observation else "neutral",
                lowest_trait,
                skill_averages,
                st.session_state.streak,
                st.session_state.daily_progress,
            )
            reflection_response = client.chat.completions.create(
                model=chat_model,
                messages=[
                    {"role": "system", "content": "You are a motivating reflection coach."},
                    {"role": "user", "content": reflection_prompt},
                ],
            )
            st.session_state["_daily_reflection"] = reflection_response.choices[0].message.content.strip(
            )

        feedback_prompt = build_feedback_prompt(
            st.session_state.goal, st.session_state.conversation_turns, style="coach")
        feedback_response = client.chat.completions.create(
            model=chat_model,
            messages=[
                {"role": "system", "content": "Respond with one sentence only."},
                {"role": "user", "content": feedback_prompt},
            ],
        )
        feedback_text = feedback_response.choices[0].message.content.strip()
        st.session_state.feedback_history.append(feedback_text)
        st.session_state["last_feedback_sentence"] = feedback_text

        st.session_state.memory = update_memory(
            st.session_state.memory,
            user_input,
            agent_responses[-1][1] if use_panel and agent_responses else ai_msg,
            tone_observation if tone_observation else "",
            score,
            feedback_text,
        )

    except Exception as e:
        st.error(f"API Error: {e}")
