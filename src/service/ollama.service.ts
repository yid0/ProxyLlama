
import { OllamaModel, OllamBodyRequest } from '../types';
import { buildDefaultResponse } from '../util/default-response';
export class ModelService {

    constructor(private readonly ollamaUrl: string) {}


  async genereateText(body: OllamBodyRequest){
  console.debug('Sending to Ollama:', body); // Debug log

  const requestBody = JSON.stringify({
    model: body.model,
    prompt: body.prompt, // Doit être une string
    stream: true
  });

  return await fetch(`${this.ollamaUrl}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: requestBody
  });  
}

    async isModelExists(modelName: string) {
        const models = await this.getModels(modelName);
        return models.length > 0;
    }

    private async getModels(modelName: string) {
        const response = await fetch(`${this.ollamaUrl}/api/tags`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (!response.ok) {
          throw new Error(`Failed to fetch models: ${response.statusText}`);
        }
    
        const data = await response.json();
        console.debug('Models response:', data); // Debug log
    
        if (Array.isArray(data.models)) {
          return data.models
            .filter((model: OllamaModel) => model.name.toLowerCase() === modelName.toLowerCase())
              .map((model: OllamaModel) => model.name);
        } else {
          console.error('Unexpected response format:', data);
          return [];
        }
    }

   serveDefaultResponse(prompt: string): string { 
    return buildDefaultResponse(prompt);
   }
    
}