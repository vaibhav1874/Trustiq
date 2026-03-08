#!/bin/bash

# Start Ollama in the background
ollama serve &

# Wait for Ollama to start
echo "Waiting for Ollama to start..."
while ! curl -s http://localhost:7860/api/tags > /dev/null; do
    sleep 2
done

# Pull the required model (e.g., llama3.1)
echo "Pulling llama3.1 model..."
ollama pull llama3.1:latest

# Keep the script running to keep the container alive
wait
