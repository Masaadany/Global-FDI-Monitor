FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all agent files
COPY . .

# Expose pipeline port
EXPOSE 8090

# Default: run pipeline server
ENV PIPELINE_MODE=server
ENV PIPELINE_PORT=8090

CMD ["python3", "agent_pipeline.py"]
