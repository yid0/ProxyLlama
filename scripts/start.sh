#!/bin/bash

# Start Ollama in the background
ollama serve &
OLLAMA_PID=$!

# Wait for Ollama to be ready
echo "Waiting for Ollama to start..."
until curl -s http://localhost:11434/api/tags > /dev/null; do
    sleep 1
done

# Pull the target model
echo "Pulling model ${OLLAMA_TARGET_MODEL}..."
ollama pull ${OLLAMA_TARGET_MODEL}

# Start the Node.js application
echo "Starting Node.js application..."
node dist/main.js

# Cleanup
kill $OLLAMA_PID
