# ProxyLlama

A Fastify proxy server for Ollama, providing a secure and efficient interface to interact with Ollama models.

## Features

- Secure HTTPS endpoints in production
- Stream responses from Ollama
- Model existence verification
- CORS support
- Helmet security headers
- Easy deployment with Docker

## Prerequisites

- Node.js 18+
- Ollama installed locally
- Docker (for containerized deployment)
- pnpm (package manager)

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

```bash
# Build the Docker image
docker build -t proxyllama .

# Run the container
docker run -p 3000:3000 -e OLLAMA_TARGET_MODEL=gemma:2b proxyllama
```

## Environment Variables

- `NODE_ENV`: Set to 'production' to enable HTTPS
- `OLLAMA_PORT`: Ollama service port (default: 11434)
- `OLLAMA_URL`: Ollama service URL (default: http://localhost:11434)
- `OLLAMA_TARGET_MODEL`: Default model to use (default: gemma:2b)

## API Endpoints

### GET /
Health check endpoint - Returns a hello message

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

## Security

In production mode, the server requires SSL certificates in the `certs` directory:
- `cert.pem`: SSL certificate
- `key.pem`: Private key

## Tech Stack

- Fastify (Node.js web framework)
- TypeScript
- Docker
- Ollama

## License

MIT
