FROM python:3.12-slim
WORKDIR /app
RUN pip install --no-cache-dir requests aiohttp anthropic python-dotenv psycopg2-binary
COPY . .
ENV PYTHONUNBUFFERED=1
ENV AGENT_SERVER_MODE=true
ENV AGENT_PORT=8080
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s CMD wget -qO- http://localhost:8080/health || exit 1
CMD ["python", "super_agent.py"]
