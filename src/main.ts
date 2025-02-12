import Fastify from 'fastify';
import * as fastifyHelmet from '@fastify/helmet';
import cors from '@fastify/cors';
import path  from 'path';
import * as fs  from 'fs';
import { OllamaResponse, OllamBodyRequest } from './types';
import { ModelService } from './service/ollama.service';




const OLLAMA_PORT = process.env.OLLAMA_PORT ||11434;
const OLLAMA_URL= process.env.OLLAMA_URL || `http://localhost:${OLLAMA_PORT}`;

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, '..', 'certs', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '..', 'certs', 'cert.pem'))
}
const server = Fastify({
  https: (process.env.NODE_ENV === 'production' ? httpsOptions : undefined) as any,
});




server.register(require('@fastify/helmet'));

server.get('/', async (request: any, reply:any) => {
  return { hello: 'Hello world from ProxyLlamma' };
});



server.get('/model/:model', async (request: any, reply: any) => {
  try {

    const modelName = request.params.model;
    const modelService = new ModelService(OLLAMA_URL);
    return await modelService.isModelExists(modelName);
   
  } catch (error) {
    console.error('Error fetching models:', error);
    reply.code(500).send({ error: 'Failed to fetch models' });
  }
});

server.post('/chat', async (request: any, reply: any) => {
  const modelName = request.body.model;

  const modelService = new ModelService(OLLAMA_URL);
  const modelExists = await modelService.isModelExists(modelName);
  if (!modelExists){
    return reply.code(400).send({ error: 'Invalid model name' });
  }
  const promptText = typeof request.body === 'string' ? request.body : request.body.prompt;

  try {

    const ollamaService = new ModelService(OLLAMA_URL);
    const ollamaResponse = await ollamaService.genereateText({
      model: modelName || process.env.OLLAMA_MODEL_NAME,
      prompt: promptText,
      stream: true
    }) 
 

    if (!ollamaResponse.ok) {
      console.error('Ollama error:', await ollamaResponse.text());
      throw new Error(`Ollama request failed: ${ollamaResponse.statusText}`);
    }

    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });

    const reader = ollamaResponse.body?.getReader();
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        try {
          const ollamaData: OllamaResponse = JSON.parse(chunk);

          if (ollamaData.response) {
            reply.raw.write(`data: ${JSON.stringify({ content: ollamaData.response })}\n\n`);
          }
        } catch (parseError) {
          console.error('Error parsing Ollama response:', parseError);
        }
      }
    }

    reply.raw.write('data: [DONE]\n\n');
    reply.raw.end();
  } catch (error) {
    console.error('Error with Ollama:', error);
    reply.code(500).send({ error: 'Failed to get response from Ollama' });
  }
});

const start = async () => {
  try {
    server.addHook('onRequest', (request: any, reply:any, done:any) => {
      console.log(`Received request : ${request.ip} → ${request.url}`);
      done();
    });

    server.register(require('@fastify/cors'), {
      origin: true,
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Accept'],
      exposedHeaders: ['Content-Type'],
      credentials: true
    });

    await server.listen({ port: 3000 });
    console.log('Server listening on '+  `${process.env.NODE_ENV === 'production' ? 'https' : 'http'}://localhost:3000}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();