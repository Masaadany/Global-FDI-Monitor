FROM python:3.12-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends gcc && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install -r requirements.txt --no-cache-dir
COPY . .
RUN useradd -m gfmagents
USER gfmagents
ENV PYTHONUNBUFFERED=1 AGENT_SERVER_MODE=true AGENT_PORT=8080
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD python3 -c "import urllib.request; urllib.request.urlopen('http://localhost:8080/health').read()" || exit 1
CMD ["python", "super_agent.py"]
