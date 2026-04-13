"""
Duolingo-style onboarding wizard for Convo AI (Streamlit).
"""

from __future__ import annotations

import os
import time
from importlib import import_module

import streamlit as st

_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

DOMAIN_MODULES: dict[str, str] = {
    "Political Science": "services.domains.political_conversation",
    "Business Communication": "services.domains.business_communication",
    "Philosophy": "services.domains.philosophy",
    "Emotional Intelligence": "services.domains.emotional_intelligence",
    "Debate Simulation": "services.domains.debate_simulation",
    "Satirical Political Commentary": "services.domains.satirical_political_commentary",
    "Artificial Intelligence & Society": "services.domains.ai_society",
    "Sales Talk": "services.domains.sales_conversation",
}

CATEGORY_DOMAINS: dict[str, list[str]] = {
    "Conversation Skills": [
        "Political Science",
        "Business Communication",
        "Sales Talk",
        "Emotional Intelligence",
    ],
    "Critical Thinking": [
        "Philosophy",
        "Debate Simulation",
        "Artificial Intelligence & Society",
    ],
    "Specialized": ["Satirical Political Commentary"],
}

DOMAIN_META: dict[str, tuple[str, str]] = {
    "Political Science": ("\U0001f3db\ufe0f", "12.4K"),
    "Business Communication": ("\U0001f4bc", "28.3K"),
    "Philosophy": ("\U0001f989", "8.7K"),
    "Emotional Intelligence": ("\U0001f49a", "15.2K"),
    "Debate Simulation": ("\u2694\ufe0f", "9.1K"),
    "Satirical Political Commentary": ("\U0001f3ad", "4.3K"),
    "Artificial Intelligence & Society": ("\U0001f916", "11.8K"),
    "Sales Talk": ("\U0001f4ca", "19.6K"),
}

SCREEN_PROGRESS_DARK: dict[str, int] = {
    "choose_goal": 30,
    "referral_source": 45,
    "daily_goal": 55,
    "skill_level": 65,
    "choose_path": 78,
    "preparing": 90,
}

PREV_SCREEN: dict[str, str] = {
    "choose_category": "landing",
    "choose_domain": "choose_category",
    "choose_goal": "choose_domain",
    "referral_source": "choose_goal",
    "daily_goal": "referral_source",
    "skill_level": "daily_goal",
    "choose_path": "skill_level",
    "preparing": "choose_path",
}

GLOBAL_DUO_CSS = """
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
html, body, [data-testid="stAppViewContainer"], .stApp {
    font-family: "Nunito", "DIN Round Pro", sans-serif !important;
}
@media screen and (max-width: 768px) {
    .block-container { padding: 1rem !important; max-width: 100% !important; }
}
"""

LIGHT_SCREEN_CSS = """
<style>
.onb-light .block-container {
    background-color: #FFFFFF !important;
    padding-top: 2rem !important;
    max-width: 900px !important;
}
.onb-light [data-testid="stSidebar"] { display: none !important; }
</style>
"""

LANDING_CSS = """
<style>
.landing-wrap { background: #FFFFFF; min-height: 85vh; padding: 24px 16px 120px; position: relative; }
.landing-logo-row { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 8px; }
.landing-logo-row h1 { color: #58CC02; font-size: 32px; font-weight: 800; margin: 0; }
.landing-hero { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 40px; margin: 32px 0; }
.landing-illus { position: relative; width: 280px; height: 280px; display: flex; align-items: center; justify-content: center; }
.landing-illus .float-emoji {
 position: absolute; font-size: 28px; animation: bounce-soft 2.5s ease-in-out infinite;
}
.landing-illus .e1 { top: 8%; left: 10%; animation-delay: 0s; }
.landing-illus .e2 { top: 12%; right: 8%; animation-delay: 0.3s; }
.landing-illus .e3 { bottom: 18%; left: 6%; animation-delay: 0.6s; }
.landing-illus .e4 { bottom: 10%; right: 12%; animation-delay: 0.9s; }
@keyframes bounce-soft {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
}
.landing-copy { max-width: 400px; text-align: left; }
.landing-copy .tag { font-size: 24px; font-weight: 700; color: #3C3C3C; margin-bottom: 8px; }
.landing-copy .sub { font-size: 16px; color: #777777; margin-bottom: 24px; }
div[data-testid="stHorizontalBlock"]:has(.get-started-wrap) button {
    background: #58CC02 !important; color: white !important; border-radius: 12px !important;
    border: none !important; border-bottom: 4px solid #46A302 !important;
    font-weight: 700 !important; font-size: 15px !important; padding: 14px 48px !important;
    text-transform: uppercase !important; box-shadow: 0 2px 0 #46A302 !important;
}
div[data-testid="stHorizontalBlock"]:has(.get-started-wrap) button:hover {
    box-shadow: 0 4px 12px rgba(88, 204, 2, 0.35) !important;
 transform: translateY(-1px);
}
div[data-testid="stHorizontalBlock"]:has(.login-wrap) button {
    background: white !important; color: #1CB0F6 !important; border-radius: 12px !important;
    border: 2px solid #1CB0F6 !important;
    font-weight: 700 !important; font-size: 15px !important; padding: 14px 48px !important;
    text-transform: uppercase !important;
}
div[data-testid="stHorizontalBlock"]:has(.login-wrap) button:hover {
    background: #DDF4FF !important;
}
.marquee-wrap {
    position: fixed; bottom: 0; left: 0; right: 0; background: #FAFAFA;
    border-top: 1px solid #E5E5E5; padding: 12px 0; overflow: hidden; z-index: 999;
}
.marquee-track {
    display: flex; gap: 12px; width: max-content;
    animation: marquee-slide 28s linear infinite;
}
@keyframes marquee-slide {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}
.domain-chip {
    background: #F0F0F0; border-radius: 20px; padding: 8px 16px; font-size: 14px;
    color: #3C3C3C; white-space: nowrap; font-weight: 600;
}
</style>
"""

DARK_LAYOUT_CSS = """
<style>
body, .stApp, [data-testid="stAppViewContainer"] {
    background-color: #131F24 !important;
}
[data-testid="stSidebar"] { display: none !important; }
.block-container {
    background-color: #131F24 !important;
    padding: 0 16px 2rem !important;
    max-width: 100% !important;
}
</style>
"""

DARK_WIZARD_CSS = """
<style>
.onb-progress-top {
    height: 16px; background: #2B3D45; width: 100vw; margin-left: calc(-50vw + 50%); margin-right: calc(-50vw + 50%);
}
.onb-progress-fill { height: 16px; background: #58CC02; transition: width 0.3s ease; }
.onb-back-btn button {
    background: transparent !important; color: #AFAFAF !important; border: none !important;
    font-size: 24px !important; padding: 4px 12px !important;
}
.mascot-row { display: flex; align-items: flex-start; gap: 12px; margin: 20px 0 24px; max-width: 520px; }
.speech-bubble {
    background: #1C2B33; border: 1.5px solid #3C4A52; border-radius: 12px;
    color: white; font-size: 16px; padding: 14px 18px; position: relative; flex: 1;
}
.speech-bubble::before {
    content: ''; position: absolute; left: -10px; top: 20px;
    border: 8px solid transparent; border-right-color: #3C4A52;
}
.speech-bubble::after {
    content: ''; position: absolute; left: -7px; top: 21px;
    border: 7px solid transparent; border-right-color: #1C2B33;
}
.options-col { max-width: 440px; margin: 0 auto; }
.duo-next-wrap button[kind="primary"] {
    background: #58CC02 !important; color: white !important; border-radius: 12px !important;
    border: none !important; border-bottom: 4px solid #46A302 !important;
    font-weight: 700 !important; font-size: 15px !important; padding: 14px 32px !important;
    text-transform: uppercase !important;
}
.duo-next-wrap button:disabled {
    background: #2B3D45 !important; color: #5A6872 !important;
    border-bottom: 3px solid #1E2D35 !important;
}
</style>
"""

PREPARING_CSS = """
<style>
.preparing-center { display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 60vh; text-align: center; }
.breathe { animation: breathe 2.5s ease-in-out infinite; }
@keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
.preparing-text { color: white; font-size: 18px; margin-top: 24px; }
.dots-loader span { animation: dot-pulse 1.2s ease-in-out infinite; opacity: 0.3; }
.dots-loader span:nth-child(2) { animation-delay: 0.2s; }
.dots-loader span:nth-child(3) { animation-delay: 0.4s; }
@keyframes dot-pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
.preparing-bar { width: 100%; max-width: 320px; height: 8px; background: #2B3D45; border-radius: 4px; margin-top: 32px; overflow: hidden; }
.preparing-bar-fill { height: 100%; background: #58CC02; border-radius: 4px; animation: fill-bar 2.5s linear forwards; }
@keyframes fill-bar { from { width: 0%; } to { width: 100%; } }
</style>
"""

CATEGORY_TILES = [
    ("\U0001f5e3\ufe0f", "Conversation Skills", "Conversation Skills"),
    ("\U0001f9e0", "Critical Thinking", "Critical Thinking"),
    ("\U0001f3ad", "Specialized", "Specialized"),
]

GOAL_OPTIONS = [
    ("\U0001f4bc", "Career Growth", "Improve professional communication", "#FF6B2B"),
    ("\U0001f9d8", "Personal Development",
     "Build confidence and self-awareness", "#CE82FF"),
    ("\u2708\ufe0f", "Networking", "Connect better with people", "#00CD9C"),
    ("\U0001f393", "Academic", "Sharpen critical thinking for class", "#1CB0F6"),
    ("\U0001f389", "Just For Fun", "Explore interesting conversations", "#FF9600"),
    ("\U0001f4da", "Self-Education", "Learn through structured AI dialogue", "#58CC02"),
    ("\u22ef", "Other", "Something else entirely", "#3C4A52"),
]

REFERRAL_OPTIONS = [
    ("\U0001f465", "Friends / Family", "Word of mouth", "#FF6B2B"),
    ("\u25b6\ufe0f", "YouTube", "Saw a demo or review", "#FF0000"),
    ("\U0001f3b5", "TikTok", "Short-form content", "#010101"),
    ("\U0001f4fa", "TV / Podcast", "Heard it mentioned", "#3C4A52"),
    ("\U0001f4f0", "Article / Blog", "Read about it online", "#1CB0F6"),
    ("\U0001f50d", "Google Search", "Found it myself", "#58CC02"),
    ("\U0001f4d8", "Social Media", "Facebook, Instagram, LinkedIn", "#1877F2"),
    ("\u22ef", "Other", "", "#3C4A52"),
]

DAILY_GOAL_OPTIONS = [
    (3, "3 conversations / day", "Casual"),
    (5, "5 conversations / day", "Regular"),
    (7, "7 conversations / day", "Serious"),
    (10, "10 conversations / day", "Intensive"),
]

SKILL_LEVEL_OPTIONS = [
    (1, "I'm completely new", "Start with the fundamentals"),
    (2, "I know a few things", "Some experience, need practice"),
    (3, "I can hold basic conversations", "Comfortable with simple exchanges"),
    (4, "I can discuss various topics", "Ready for complex scenarios"),
    (5, "I can discuss most things deeply", "Looking for advanced challenges"),
]


def load_mascot_svg() -> str:
    path = os.path.join(_ROOT, "assets", "mascot.svg")
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except OSError:
        return (
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><circle cx="40" cy="40" r="36" fill="#58CC02"/>'
            '<circle cx="28" cy="34" r="5" fill="#fff"/><circle cx="52" cy="34" r="5" fill="#fff"/></svg>'
        )


def signal_svg(level: int) -> str:
    """Three ascending bars; more levels light more bars (levels 4–5 fill all three)."""
    heights = [6, 10, 15]
    xs = [1, 8, 15]
    n_fill = min(max(level, 1), 3) if level < 4 else 3
    parts = []
    for i in range(3):
        h = heights[i]
        y = 20 - h
        color = "#58CC02" if i < n_fill else "#3C4A52"
        parts.append(
            f'<rect x="{xs[i]}" y="{y}" width="4" height="{h}" rx="1" fill="{color}"/>')
    inner = "".join(parts)
    return f'<svg width="20" height="20" viewBox="0 0 20 20" style="flex-shrink:0">{inner}</svg>'


def _set_screen(name: str) -> None:
    st.session_state["screen"] = name


def _finalize_onboarding_answers() -> None:
    st.session_state["onboarding_answers"] = {
        "category": st.session_state.get("category"),
        "selected_domain": st.session_state.get("selected_domain"),
        "selected_subdomain": st.session_state.get("selected_subdomain"),
        "practice_goal": st.session_state.get("practice_goal"),
        "referral_source": st.session_state.get("referral_source"),
        "daily_goal": st.session_state.get("daily_goal"),
        "skill_level": st.session_state.get("skill_level"),
        "start_path": st.session_state.get("start_path"),
    }


def _apply_subdomain_from_path() -> None:
    domain = st.session_state.get("selected_domain")
    if not domain:
        return
    mod = import_module(DOMAIN_MODULES[domain])
    subdomains = mod.get_subdomains()
    if not subdomains:
        return
    level = st.session_state.get("skill_level") or 3
    path = st.session_state.get("start_path") or "guided"
    if path == "guided":
        st.session_state["selected_subdomain"] = subdomains[0]
    else:
        idx = min(max(int(level) - 1, 0), len(subdomains) - 1)
        st.session_state["selected_subdomain"] = subdomains[idx]


def _dark_header(progress_pct: int, speech: str) -> None:
    st.markdown(DARK_LAYOUT_CSS + DARK_WIZARD_CSS, unsafe_allow_html=True)
    st.markdown(
        f'<div class="onb-progress-top"><div class="onb-progress-fill" style="width:{progress_pct}%;"></div></div>',
        unsafe_allow_html=True,
    )
    c0, _ = st.columns([1, 8])
    with c0:
        cur = st.session_state.get("screen", "")
        if cur in PREV_SCREEN and st.button("\u2190", key=f"back_{cur}"):
            _set_screen(PREV_SCREEN[cur])
            st.rerun()
    mascot = load_mascot_svg()
    st.markdown(
        f'<div class="mascot-row"><div style="width:80px;height:80px;flex-shrink:0;">{mascot}</div>'
        f'<div class="speech-bubble">{speech}</div></div>',
        unsafe_allow_html=True,
    )


def render_landing(mascot: str) -> None:
    st.markdown('<div class="onb-light">', unsafe_allow_html=True)
    st.markdown(LIGHT_SCREEN_CSS + LANDING_CSS, unsafe_allow_html=True)
    chips_inner = ""
    strip = [
        ("\U0001f3db\ufe0f", "Political Science"),
        ("\U0001f4bc", "Business"),
        ("\U0001f989", "Philosophy"),
        ("\u2694\ufe0f", "Debate"),
        ("\U0001f4ca", "Sales"),
        ("\U0001f49a", "Emotional Intelligence"),
        ("\U0001f916", "AI & Society"),
        ("\U0001f3ad", "Satirical Commentary"),
    ]
    for _ in range(4):
        for em, lab in strip:
            chips_inner += f'<span class="domain-chip">{em} {lab}</span>'
    chips_html = f'<div class="marquee-wrap"><div class="marquee-track">{chips_inner}</div></div>'

    hero = f"""
<div class="landing-wrap">
  <div class="landing-logo-row">
    <div style="width:48px;height:48px;">{mascot}</div>
    <h1>Convo AI</h1>
  </div>
  <div class="landing-hero">
    <div class="landing-illus">
      <span class="float-emoji e1">\U0001f3af</span>
      <span class="float-emoji e2">\U0001f9e0</span>
      <span class="float-emoji e3">\U0001f4ac</span>
      <span class="float-emoji e4">\U0001f4c8</span>
      <div style="width:200px;height:200px;">{mascot.replace('width="80"', 'width="200"').replace('height="80"', 'height="200"')}</div>
    </div>
    <div class="landing-copy">
      <div class="tag">The smart, effective way to master communication.</div>
      <div class="sub">Practice real conversations. Get AI coaching. Level up.</div>
    </div>
  </div>
</div>
"""
    st.markdown(hero, unsafe_allow_html=True)
    c1, c2 = st.columns(2)
    with c1:
        st.markdown('<div class="get-started-wrap"></div>',
                    unsafe_allow_html=True)
        if st.button("GET STARTED", key="landing_get_started", use_container_width=True):
            _set_screen("choose_category")
            st.rerun()
    with c2:
        st.markdown('<div class="login-wrap"></div>', unsafe_allow_html=True)
        if st.button("I ALREADY HAVE AN ACCOUNT", key="landing_login", use_container_width=True):
            first_domain = next(iter(DOMAIN_MODULES.keys()))
            st.session_state["selected_domain"] = first_domain
            mod = import_module(DOMAIN_MODULES[first_domain])
            subs = mod.get_subdomains()
            st.session_state["selected_subdomain"] = subs[0] if subs else None
            st.session_state["onboarding_complete"] = True
            st.session_state["_onboarding_wired"] = False
            st.rerun()
    st.markdown(chips_html, unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)


def render_choose_category(mascot: str) -> None:
    st.markdown(LIGHT_SCREEN_CSS, unsafe_allow_html=True)
    st.markdown(
        '<h2 style="text-align:center;font-size:28px;color:#3C3C3C;font-family:Nunito,sans-serif">'
        "What would you like to practice?</h2>",
        unsafe_allow_html=True,
    )
    cols = st.columns(3)
    for i, (emoji, label, value) in enumerate(CATEGORY_TILES):
        with cols[i]:
            sel = st.session_state.get("category") == value
            border = "2px solid #1CB0F6" if sel else "1px solid #E5E5E5"
            bg = "#EEF9FF" if sel else "#FFFFFF"
            st.markdown(
                f'<div style="text-align:center;padding:16px;border-radius:16px;border:{border};background:{bg};min-height:200px;">'
                f'<div style="font-size:80px;line-height:1;">{emoji}</div>'
                f'<div style="font-size:16px;font-weight:700;color:#3C3C3C;margin-top:8px;">{label}</div></div>',
                unsafe_allow_html=True,
            )
            if st.button("Select", key=f"cat_{i}", use_container_width=True):
                st.session_state["category"] = value
                st.rerun()
    _, r = st.columns([4, 1])
    with r:
        next_disabled = not st.session_state.get("category")
        if st.button("NEXT \u2192", key="cat_next", disabled=next_disabled, type="primary"):
            _set_screen("choose_domain")
            st.rerun()


def render_choose_domain(mascot: str) -> None:
    st.markdown(LIGHT_SCREEN_CSS, unsafe_allow_html=True)
    pct = 15
    st.markdown(
        f'<div style="width:100%;height:16px;background:#E5E5E5;border-radius:8px;margin-bottom:16px;">'
        f'<div style="width:{pct}%;height:16px;background:#58CC02;border-radius:8px;"></div></div>',
        unsafe_allow_html=True,
    )
    c0, _ = st.columns([1, 6])
    with c0:
        if st.button("\u2190", key="domain_back"):
            _set_screen("choose_category")
            st.rerun()
    st.markdown(
        '<h2 style="text-align:center;font-size:28px;font-weight:700;color:#3C3C3C;">'
        "I want to practice...</h2>",
        unsafe_allow_html=True,
    )
    cat = st.session_state.get("category")
    domains = CATEGORY_DOMAINS.get(cat, list(DOMAIN_MODULES.keys()))
    cols_per_row = 4
    for row_start in range(0, len(domains), cols_per_row):
        row = domains[row_start: row_start + cols_per_row]
        cols = st.columns(len(row))
        for j, d in enumerate(row):
            emoji, k = DOMAIN_META.get(d, ("\u2b50", "0K"))
            sel = st.session_state.get("selected_domain") == d
            border = "2px solid #1CB0F6" if sel else "2px solid #E5E5E5"
            bg = "#EEF9FF" if sel else "#FFFFFF"
            with cols[j]:
                st.markdown(
                    f'<div style="text-align:center;padding:12px;border-radius:16px;border:{border};background:{bg};min-width:150px;min-height:160px;">'
                    f'<div style="font-size:48px;">{emoji}</div>'
                    f'<div style="font-size:14px;font-weight:700;color:#3C3C3C;margin-top:8px;">{d}</div>'
                    f'<div style="font-size:12px;color:#777;margin-top:6px;">{k} practitioners</div></div>',
                    unsafe_allow_html=True,
                )
                if st.button("Pick", key=f"dom_{row_start}_{j}", use_container_width=True):
                    st.session_state["selected_domain"] = d
                    st.rerun()
    _, r = st.columns([4, 1])
    with r:
        if st.button("NEXT \u2192", key="dom_next", disabled=not st.session_state.get("selected_domain"), type="primary"):
            _set_screen("choose_goal")
            st.rerun()


def render_goal_screen() -> None:
    _dark_header(
        SCREEN_PROGRESS_DARK["choose_goal"], "Why are you practicing?")
    st.markdown('<div class="options-col">', unsafe_allow_html=True)
    for row_i in range(0, len(GOAL_OPTIONS), 2):
        pair = GOAL_OPTIONS[row_i: row_i + 2]
        cols = st.columns(2)
        for col_idx, (em, title, sub, color) in enumerate(pair):
            with cols[col_idx]:
                sel = st.session_state.get("practice_goal") == title
                st.markdown(
                    f'<div style="margin-bottom:8px;padding:12px;border-radius:16px;border:2px solid {"#1CB0F6" if sel else "#3C4A52"};background:{"#1A3A4A" if sel else "#1C2B33"};">'
                    f'<div style="display:flex;align-items:center;gap:12px;">'
                    f'<div style="width:48px;height:48px;border-radius:10px;background:{color};display:flex;align-items:center;justify-content:center;font-size:24px;">{em}</div>'
                    f'<div><div style="font-size:15px;font-weight:700;color:#fff;">{title}</div>'
                    f'<div style="font-size:13px;color:#7A8E97;margin-top:2px;">{sub}</div></div></div></div>',
                    unsafe_allow_html=True,
                )
                if st.button("Choose", key=f"goal_{row_i}_{col_idx}", use_container_width=True):
                    st.session_state["practice_goal"] = title
                    st.rerun()
    st.markdown("</div>", unsafe_allow_html=True)
    _, rr = st.columns([3, 1])
    with rr:
        st.markdown('<div class="duo-next-wrap"></div>',
                    unsafe_allow_html=True)
        if st.button("NEXT", key="goal_next_btn", disabled=not st.session_state.get("practice_goal"), type="primary"):
            _set_screen("referral_source")
            st.rerun()


def render_referral_screen() -> None:
    _dark_header(
        SCREEN_PROGRESS_DARK["referral_source"], "How did you find Convo AI?")
    st.markdown('<div class="options-col">', unsafe_allow_html=True)
    for row_i in range(0, len(REFERRAL_OPTIONS), 2):
        pair = REFERRAL_OPTIONS[row_i: row_i + 2]
        cols = st.columns(2)
        for col_idx, (em, title, sub, color) in enumerate(pair):
            with cols[col_idx]:
                sel = st.session_state.get("referral_source") == title
                st.markdown(
                    f'<div style="margin-bottom:8px;padding:12px;border-radius:16px;border:2px solid {"#1CB0F6" if sel else "#3C4A52"};background:{"#1A3A4A" if sel else "#1C2B33"};">'
                    f'<div style="display:flex;align-items:center;gap:12px;">'
                    f'<div style="width:48px;height:48px;border-radius:10px;background:{color};display:flex;align-items:center;justify-content:center;font-size:22px;">{em}</div>'
                    f'<div><div style="font-size:15px;font-weight:700;color:#fff;">{title}</div>'
                    f'<div style="font-size:13px;color:#7A8E97;margin-top:2px;">{sub}</div></div></div></div>',
                    unsafe_allow_html=True,
                )
                if st.button("Choose", key=f"ref_{row_i}_{col_idx}", use_container_width=True):
                    st.session_state["referral_source"] = title
                    st.rerun()
    st.markdown("</div>", unsafe_allow_html=True)
    _, rr = st.columns([3, 1])
    with rr:
        st.markdown('<div class="duo-next-wrap"></div>',
                    unsafe_allow_html=True)
        if st.button("NEXT", key="ref_next_btn", type="primary"):
            st.session_state["onboarding_daily_goal_chosen"] = False
            _set_screen("daily_goal")
            st.rerun()


def render_daily_goal_screen() -> None:
    st.session_state.setdefault("onboarding_daily_goal_chosen", False)
    _dark_header(SCREEN_PROGRESS_DARK["daily_goal"], "What goal shall we set?")
    st.markdown('<div class="options-col">', unsafe_allow_html=True)
    for n, left, right in DAILY_GOAL_OPTIONS:
        sel = st.session_state.get("daily_goal") == n and st.session_state.get(
            "onboarding_daily_goal_chosen")
        st.markdown(
            f'<div style="margin-bottom:10px;padding:16px 20px;border-radius:16px;border:2px solid {"#1CB0F6" if sel else "#3C4A52"};background:{"#1A3A4A" if sel else "#1C2B33"};display:flex;justify-content:space-between;align-items:center;">'
            f'<span style="font-size:15px;font-weight:700;color:#fff;">{left}</span>'
            f'<span style="font-size:14px;color:#7A8E97;">{right}</span></div>',
            unsafe_allow_html=True,
        )
        if st.button("Select goal", key=f"dg_{n}", use_container_width=True):
            st.session_state["daily_goal"] = n
            st.session_state["onboarding_daily_goal_chosen"] = True
            st.rerun()
    st.markdown("</div>", unsafe_allow_html=True)
    _, rr = st.columns([3, 1])
    with rr:
        st.markdown('<div class="duo-next-wrap"></div>',
                    unsafe_allow_html=True)
        if st.button(
            "NEXT",
            key="dg_next_btn",
            disabled=not st.session_state.get("onboarding_daily_goal_chosen"),
            type="primary",
        ):
            _set_screen("skill_level")
            st.rerun()


def render_skill_level_screen() -> None:
    _dark_header(SCREEN_PROGRESS_DARK["skill_level"],
                 "Great, let's build your skills!")
    st.markdown('<div class="options-col">', unsafe_allow_html=True)
    for lvl, title, sub in SKILL_LEVEL_OPTIONS:
        sel = st.session_state.get("skill_level") == lvl
        sig = signal_svg(lvl)
        st.markdown(
            f'<div style="margin-bottom:10px;padding:16px 20px;border-radius:16px;border:2px solid {"#1CB0F6" if sel else "#3C4A52"};background:{"#1A3A4A" if sel else "#1C2B33"};display:flex;align-items:center;gap:14px;">'
            f'<div>{sig}</div>'
            f'<div><div style="font-size:15px;font-weight:700;color:#fff;">{title}</div>'
            f'<div style="font-size:13px;color:#7A8E97;margin-top:2px;">{sub}</div></div></div>',
            unsafe_allow_html=True,
        )
        if st.button("Select level", key=f"sl_{lvl}", use_container_width=True):
            st.session_state["skill_level"] = lvl
            st.rerun()
    st.markdown("</div>", unsafe_allow_html=True)
    _, rr = st.columns([3, 1])
    with rr:
        st.markdown('<div class="duo-next-wrap"></div>',
                    unsafe_allow_html=True)
        if st.button("NEXT", key="sl_next_btn", disabled=not st.session_state.get("skill_level"), type="primary"):
            _set_screen("choose_path")
            st.rerun()


def render_choose_path_screen() -> None:
    _dark_header(SCREEN_PROGRESS_DARK["choose_path"],
                 "Now let's decide which path to take!")
    st.markdown('<div class="options-col">', unsafe_allow_html=True)
    paths = [
        ("\U0001f4cb", "guided", "Start from the beginning",
         "Walk through a guided intro scenario", "#FF9600"),
        ("\U0001f3af", "assess", "Assess my level",
         "Convo AI will suggest where to start", "#1CB0F6"),
    ]
    for em, pkey, title, sub, color in paths:
        sel = st.session_state.get("start_path") == pkey
        st.markdown(
            f'<div style="margin-bottom:12px;padding:18px 20px;border-radius:16px;border:2px solid {"#1CB0F6" if sel else "#3C4A52"};background:{"#1A3A4A" if sel else "#1C2B33"};min-height:88px;">'
            f'<div style="display:flex;align-items:center;gap:16px;">'
            f'<div style="width:48px;height:48px;border-radius:10px;background:{color};display:flex;align-items:center;justify-content:center;font-size:24px;">{em}</div>'
            f'<div><div style="font-size:16px;font-weight:700;color:#fff;">{title}</div>'
            f'<div style="font-size:13px;color:#7A8E97;margin-top:4px;">{sub}</div></div></div></div>',
            unsafe_allow_html=True,
        )
        if st.button("Choose path", key=f"path_{pkey}", use_container_width=True):
            st.session_state["start_path"] = pkey
            st.rerun()
    st.markdown("</div>", unsafe_allow_html=True)
    _, rr = st.columns([3, 1])
    with rr:
        st.markdown('<div class="duo-next-wrap"></div>',
                    unsafe_allow_html=True)
        if st.button("NEXT", key="path_next_btn", disabled=not st.session_state.get("start_path"), type="primary"):
            _set_screen("preparing")
            st.session_state.pop("preparing_deadline", None)
            st.rerun()


def render_preparing(mascot: str) -> None:
    st.markdown(DARK_LAYOUT_CSS + PREPARING_CSS, unsafe_allow_html=True)
    m = mascot.replace('width="80"', 'width="120"').replace(
        'height="80"', 'height="120"')
    st.markdown(
        f'<div class="preparing-center">'
        f'<div class="breathe">{m}</div>'
        f'<div class="preparing-text">Setting up your personalized experience...</div>'
        f'<div class="dots-loader preparing-text"><span>\u25cf</span> <span>\u25cf</span> <span>\u25cf</span></div>'
        f'<div class="preparing-bar"><div class="preparing-bar-fill"></div></div>'
        f"</div>",
        unsafe_allow_html=True,
    )
    if "preparing_deadline" not in st.session_state:
        st.session_state["preparing_deadline"] = time.time() + 2.5
    deadline = st.session_state["preparing_deadline"]
    if time.time() >= deadline:
        _apply_subdomain_from_path()
        _finalize_onboarding_answers()
        st.session_state["onboarding_complete"] = True
        st.session_state.pop("preparing_deadline", None)
        st.session_state["_onboarding_wired"] = False
        st.rerun()
    time.sleep(0.25)
    st.rerun()


def render_onboarding() -> None:
    mascot = load_mascot_svg()
    screen = st.session_state.get("screen", "landing")
    st.markdown(GLOBAL_DUO_CSS, unsafe_allow_html=True)

    if screen == "landing":
        render_landing(mascot)
    elif screen == "choose_category":
        render_choose_category(mascot)
    elif screen == "choose_domain":
        render_choose_domain(mascot)
    elif screen == "choose_goal":
        render_goal_screen()
    elif screen == "referral_source":
        render_referral_screen()
    elif screen == "daily_goal":
        render_daily_goal_screen()
    elif screen == "skill_level":
        render_skill_level_screen()
    elif screen == "choose_path":
        render_choose_path_screen()
    elif screen == "preparing":
        render_preparing(mascot)
    else:
        _set_screen("landing")
        st.rerun()
