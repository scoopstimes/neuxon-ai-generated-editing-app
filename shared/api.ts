/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export interface EditImage {
  mimeType: string;
  data: string; // base64 without data URL prefix
}

export interface EditRequestBody {
  apiKey: string;
  prompt: string;
  images: EditImage[];
  model?: string;
}

export interface EditSuccessResponse {
  images: EditImage[];
}

export interface EditErrorResponse {
  error: string;
  details?: unknown;
}
