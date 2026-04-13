import tempfile
from gtts import gTTS
import streamlit as st

def speak(text: str):
    """
    Convert text to speech using gTTS, play via Streamlit audio widget.
    """
    try:
        tts = gTTS(text=text, lang='en')
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
            tts.write_to_fp(tmp)
            tmp_path = tmp.name
        st.audio(tmp_path, format='audio/mp3')
    except Exception as e:
        st.error(f"Error in voice playback: {e}")
