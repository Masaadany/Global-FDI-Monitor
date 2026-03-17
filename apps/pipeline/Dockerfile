FROM python:3.12-slim
WORKDIR /app
RUN pip install --no-cache-dir requests aiohttp z3-solver python-dotenv psycopg2-binary
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt 2>/dev/null || true
COPY . .
ENV PYTHONUNBUFFERED=1
CMD ["python", "collectors/master_pipeline.py"]
