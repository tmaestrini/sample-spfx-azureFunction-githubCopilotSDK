import { HttpRequest, InvocationContext, HttpResponseInit } from "@azure/functions";

export type AzureFunction = (request: HttpRequest, context: InvocationContext) => Promise<HttpResponseInit>;
export type MiddlewareFunction = (request: HttpRequest, context: InvocationContext) => Promise<{success: boolean, error?: string}>;

/**
 * Middleware wrapper that executes middleware functions before the main handler
 * @param fn - The main function handler
 * @param middlewares - Array of middleware functions to execute
 * @returns Wrapped function with middleware chain
 */
const middleware = (fn: AzureFunction, middlewares?: MiddlewareFunction[]): AzureFunction => {
  // Return a new function (that matches the AzureFunction type) that includes middleware processing
  return async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    // Execute middleware chain
    for (const middlewareFunction of middlewares ?? []) {
      const result = await middlewareFunction(request, context);

      if (!result.success) {
        context.warn(`⚠️ ${result.error}`);
        return {
          status: 403,
          jsonBody: {
            error: 'Forbidden',
            message: result.error
          }
        };
      }
    }
    
    // All middleware passed, execute main function
    return await fn(request, context);
  };
};

/**
 * Middleware to check for API key in request headers
 * @param request - HTTP request
 * @param context - Invocation context
 * @returns Object indicating success or failure with an optional error message
 */
const checkForApiKey: MiddlewareFunction = async (request: HttpRequest, context: InvocationContext): Promise<{success: boolean, error?: string}> => {
  const apiKey = request.headers.get('x-api-key');
  context.log('Checking API key...');
  
  if (!apiKey) {
    return { success: false, error: 'No API key provided' };
  }
  
  // Validate API key (replace with your actual validation logic)
  const validApiKey = process.env.API_KEY;
  if (apiKey !== validApiKey) {
    return { success: false, error: 'Invalid API key provided' };
  }
  
  context.log('API key validated successfully');
  return { success: true };
};

export { middleware, checkForApiKey };