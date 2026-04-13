# setup.py

from setuptools import setup, find_packages

setup(
    name="convo_ai",
    version="0.1.0",
    description="A Duolingo-style AI conversation training app built with Streamlit and OpenAI.",
    author="Your Name",
    author_email="you@example.com",
    packages=find_packages(include=["components*", "services*", "services.domains*", "data*"]),
    include_package_data=True,
    install_requires=[
        "streamlit",
        "openai",
        "matplotlib",
        "numpy",
        "python-dotenv",
        "speechrecognition",
        "requests"
    ],
    python_requires=">=3.9",
    entry_points={
        "console_scripts": [
            "convo-ai=app:main"
        ]
    }
)
