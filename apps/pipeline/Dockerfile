FROM python:3.12-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends gcc && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install -r requirements.txt --no-cache-dir
COPY . .
RUN useradd -m gfmpipeline
USER gfmpipeline
ENV PYTHONUNBUFFERED=1
CMD ["python", "collectors/master_pipeline.py"]
