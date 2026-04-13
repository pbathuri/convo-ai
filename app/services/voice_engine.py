import speech_recognition as sr

def record_and_transcribe(audio_file):
    """
    Transcribes an uploaded audio file to text using SpeechRecognition.
    """
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_file) as source:
        audio_data = recognizer.record(source)
    return recognizer.recognize_google(audio_data)
