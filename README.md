# ProxyLlama

A secure proxy server for Ollama, featuring both a REST API and a web interface for interacting with Large Language Models.

## Features

- Secure HTTPS endpoints in production
- Stream responses from Ollama
- Model existence verification
- CORS support
- Helmet security headers
- Easy deployment with Docker
- Interactive web interface
- Real-time chat with AI models
- Model selection from available options
- Message streaming with live updates
- Kubernetes-ready deployment

## Prerequisites

- Node.js 18+
- Ollama installed locally or via Docker
- Docker (for containerized deployment)
- pnpm (package manager)
- Kubernetes/MicroK8s (optional, for cluster deployment)

## Installation

```bash
# Install dependencies
pnpm install

# Build the application
pnpm build
```

## Development

```bash
# Start in development mode
pnpm dev
```

## Production

```bash
# Build and start the application
pnpm build
pnpm start
```

## Docker Deployment

ProxyLlama provides two Docker images:
- `yidoughi/ollama`: Standalone Ollama server
- `yidoughi/proxyllama`: API proxy server

```bash
# Build the Docker images
make build-ollama
make build-proxyllama

# Run the containers
make run-ollama
make run-proxyllama

# Or directly pull from Docker Hub
docker run -p 3000:3000 -p 11434:11434 yidoughi/proxyllama:latest
```

## Kubernetes Deployment

Deploy to a Kubernetes cluster using:

```bash
# Deploy to MicroK8s
make deploy

# Expose services
make expose

# Stop deployment
make stop
```

## Environment Variables

### Server Configuration
- `NODE_ENV`: Set to 'production' to enable HTTPS
- `PROXY_PORT`: API server port (default: 3000)
- `PROXY_HOME`: Application home directory (default: "/app")
- `PROXY_CERTS_DIR`: SSL certificates directory (default: "/app/certs")

### Ollama Configuration
- `OLLAMA_PORT`: Ollama service port (default: 11434)
- `OLLAMA_HOST`: Ollama service host URL (default: "http://localhost:11434")
- `OLLAMA_TARGET_MODEL`: Default model to use (default: "gemma:2b")
- `OLLAMA_HOME`: Ollama configuration directory (default: "/home/ollama/.ollama")
- `OLLAMA_MODELS`: Models directory location (default: "/home/ollama/.ollama/models")
- `OLLAMA_DEBUG`: Enable debug mode (default: "false")
- `OLLAMA_MAX_LOADED_MODELS`: Maximum number of models to keep loaded (default: 0 for unlimited)
- `OLLAMA_MAX_QUEUE`: Maximum request queue size (default: 512)
- `OLLAMA_NUM_PARALLEL`: Number of parallel requests (optional)

## API Endpoints

### GET /
Health check endpoint - Returns version and status information

### GET /model/:model
Check if a specific model exists

### POST /chat
Send a chat request to the model

Request body:
```json
{
  "model": "gemma:2b",
  "prompt": "Your question here",
  "stream": true
}
```

## Web Interface

The project includes a responsive web interface that provides:
- Real-time chat with AI models
- Model selection dropdown with 20+ models
- Message streaming with typing animation
- Syntax highlighting for code
- Markdown-style formatting
- Responsive design for all devices
- Model name display in responses

## Security

### Production Mode
In production mode, the server requires SSL certificates in the `certs` directory:
- `cert.pem`: SSL certificate
- `key.pem`: Private key

### Docker Security
- Runs as non-root user (UID 1001)
- Uses secure default configurations
- Implements proper permission management
- Follows container security best practices

## Available Models

The system supports various Ollama models including:
- LLaMA 3.2 1B
- Gemma 2B/7B
- LLaMA 2 (7B, 13B)
- Mistral 7B
- Mixtral 8x7B
- Neural Chat 7B
- CodeLlama (7B, 13B)
- Qwen 2.5 Coder
- Starling LM 7B
- Vicuna (7B, 13B)
- And many more...

## Technical Stack

### Backend
- Fastify (Node.js web framework)
- TypeScript
- Docker
- Ollama
- Kubernetes (optional)

### Frontend
- Web Components
- TypeScript
- ES6+ JavaScript
- CSS3
- Bootstrap 5

## Contributing

Feel free to submit issues and enhancement requests.

## License

MIT
