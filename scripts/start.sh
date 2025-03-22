#!/bin/bash

if [ ! -d "$OLLAMA_HOME" ]; then
  mkdir -p "$OLLAMA_HOME"
  echo "Created OLLAMA_HOME directory at $OLLAMA_HOME"
fi

echo "Starting Ollama server..."
OLLAMA_HOME="$OLLAMA_HOME" OLLAMA_HOST="$OLLAMA_HOST" ollama serve &
OLLAMA_PID=$!

echo "Waiting for Ollama to start..."
until curl -s http://localhost:11434/api/tags >/dev/null 2>&1; do
  sleep 1
done

echo "Ollama is ready!"

trap "kill $OLLAMA_PID $NODE_PID" EXIT

wait