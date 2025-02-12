export interface OllamBodyRequest {
    model: 'gemma2:2b',
    prompt: string,
    format?: "json",
    stream?: boolean | false
  }

export interface OllamaResponse {
    model: string;
    created_at: string;
    response: string;
    done: boolean;
}
  
export interface OllamaModel {
    name: string;
    // Ajoutez d'autres champs si nécessaire
}