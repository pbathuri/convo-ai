# Full Convo AI (Streamlit) — deploy on Render, Railway, Fly.io, Google Cloud Run, etc.
# These platforms set PORT; Streamlit must bind0.0.0.0.

FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY components ./components
COPY data ./data
COPY assets ./assets

RUN mkdir -p .streamlit
COPY streamlit/config.toml .streamlit/config.toml

ENV PYTHONPATH=/app/app:/app
ENV STREAMLIT_BROWSER_GATHER_USAGE_STATS=false
ENV STREAMLIT_SERVER_HEADLESS=true

EXPOSE 8501

# PORT is injected by Render, Railway, Fly, Cloud Run, etc.
CMD sh -c 'exec streamlit run app/app.py \
    --server.port="${PORT:-8501}" \
    --server.address=0.0.0.0 \
    --browser.gatherUsageStats=false'
