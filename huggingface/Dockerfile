# Use Ollama base image
FROM ollama/ollama:latest

# Set Ollama to listen on port 7860 (Hugging Face default)
ENV OLLAMA_HOST=0.0.0.0:7860

# Expose port 7860
EXPOSE 7860

# Install curl for health checks and pulling models
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Add entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
