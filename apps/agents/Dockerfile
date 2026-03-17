FROM python:3.12-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends libpq5 curl \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --uid 1001 --create-home agent
COPY --chown=agent:agent ../pipeline/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY --chown=agent:agent . .
COPY --chown=agent:agent ../pipeline/collectors ./collectors
COPY --chown=agent:agent ../pipeline/data_provenance.py .
USER agent
ENV PYTHONUNBUFFERED=1
HEALTHCHECK --interval=30s CMD python -c "from super_agent import GFMSuperAgent; print('ok')" || exit 1
CMD ["python", "super_agent.py", "--serve"]
