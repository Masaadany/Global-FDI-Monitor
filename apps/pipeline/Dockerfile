FROM python:3.12-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends libpq5 \
    && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN adduser --uid 1001 --disabled-password pipeline
USER pipeline
ENV PYTHONUNBUFFERED=1
CMD ["python", "collectors/master_pipeline.py"]
