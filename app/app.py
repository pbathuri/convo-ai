from services.skill_tracker import init_skill_tracker
from services.llm_factory import create_llm_client_and_model
from components.onboarding import DOMAIN_MODULES, render_onboarding
from components.chat_ui import render_chat
from dotenv import load_dotenv
import streamlit as st
import json
import os
import sys
from importlib import import_module

_app_dir = os.path.dirname(os.path.abspath(__file__))
_repo_root = os.path.abspath(os.path.join(_app_dir, ".."))
for _p in (_repo_root, _app_dir):
    if _p not in sys.path:
        sys.path.insert(0, _p)


st.set_page_config(
    page_title="\U0001f9e0 Convo AI",
    page_icon="\U0001f916",
    layout="wide",
    initial_sidebar_state="collapsed",
)

learning_map = {}


def load_learning_map_silent() -> None:
    global learning_map
    json_path = os.path.join(
        os.path.dirname(__file__), "..", "data", "learning_progression.json"
    )
    if not os.path.exists(json_path):
        json_path = "data/learning_progression.json"
    if os.path.exists(json_path):
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                content = f.read().strip()
                if content:
                    learning_map = json.loads(content)
        except (OSError, json.JSONDecodeError):
            learning_map = {}


def inject_global_css() -> None:
    st.markdown(
        """
<style>
[data-testid="stSidebar"] { display: none !important; }
@media screen and (max-width: 768px) {
    .block-container { padding: 1rem !important; }
    .stButton button { font-size: 0.9rem !important; }
}
</style>
""",
        unsafe_allow_html=True,
    )


def init_state() -> None:
    defaults = {
        "xp": 0,
        "streak": 0,
        "last_used": None,
        "memory": [],
        "skills": init_skill_tracker(),
        "daily_goal": 5,
        "daily_progress": 0,
        "daily_completed": False,
        "favorability_streak": 0,
        "last_spoken_text": "",
        "favorability_scores": [],
        "conversation_turns": [],
        "ai_responses": [],
        "feedback_history": [],
        "conversation_timer": {
            "start_time": None,
            "end_time": None,
            "time_limit_seconds": None,
            "expired": False,
        },
        "screen": "landing",
        "onboarding_complete": False,
        "category": None,
        "selected_domain": None,
        "selected_subdomain": None,
        "practice_goal": None,
        "referral_source": None,
        "skill_level": None,
        "start_path": None,
        "onboarding_answers": {},
        "chat_messages": [],
        "_onboarding_wired": False,
    }
    for key, val in defaults.items():
        if key not in st.session_state:
            st.session_state[key] = val


init_state()
inject_global_css()
load_learning_map_silent()

for _key in ("scenario_context", "goal", "persona", "selected_traits"):
    if _key not in st.session_state:
        st.session_state[_key] = ""

if not st.session_state["onboarding_complete"]:
    render_onboarding()
    st.stop()

load_dotenv()
client, chat_model, llm_provider = create_llm_client_and_model()

if not st.session_state.get("_onboarding_wired"):
    domain = st.session_state.get("selected_domain")
    if domain and domain in DOMAIN_MODULES:
        mod = import_module(DOMAIN_MODULES[domain])
        subs = mod.get_subdomains()
        if not st.session_state.get("selected_subdomain") and subs:
            st.session_state["selected_subdomain"] = subs[0]
    pg = st.session_state.get("practice_goal")
    if pg:
        st.session_state["goal"] = f"Improve communication ({pg})"
    st.session_state["_onboarding_wired"] = True

if client is None:
    st.error(
        "No LLM client configured. Set **USE_OLLAMA=true** (and run Ollama locally), "
        "or set **OPENAI_API_KEY** for OpenAI. See `.env.example`."
    )
    st.stop()

render_chat(client, chat_model=chat_model, llm_provider=llm_provider)
