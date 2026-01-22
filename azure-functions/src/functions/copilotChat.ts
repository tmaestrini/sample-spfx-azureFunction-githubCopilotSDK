import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CopilotClient } from "@github/copilot-sdk";
import configuration from "../config.js";

/**
 * Azure Function HTTP trigger for GitHub Copilot SDK integration
 * Accepts a prompt and returns the Copilot response
 * @see https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md#step-2-send-your-first-message
 */
export async function copilotChat(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('HTTP trigger function processing a request.');

    try {
        // Parse request body
        const body = await request.json() as { prompt?: string; model?: string };
        const prompt = body?.prompt;
        const model = body?.model || configuration.model.model;

        // Validate input
        if (!prompt) {
            return {
                status: 400,
                jsonBody: {
                    error: "Missing 'prompt' in request body"
                }
            };
        }

        context.log(`Processing prompt: ${prompt.substring(0, 50)}...`);

        // Initialize Copilot Client
        const client = new CopilotClient();
        
        try {
            // Create session with specified model
            const session = await client.createSession({ model });
            
            // Send prompt and wait for response
            const response = await session.sendAndWait({ prompt });
            
            // Stop the client
            await client.stop();

            // Return successful response
            return {
                status: 200,
                jsonBody: {
                    content: response?.data.content,
                    model: model,
                    timestamp: new Date().toISOString()
                }
            };
        } catch (copilotError) {
            context.error('Copilot SDK error:', copilotError);
            
            // Ensure client is stopped
            try {
                await client.stop();
            } catch (stopError) {
                context.error('Error stopping client:', stopError);
            }
            
            return {
                status: 500,
                jsonBody: {
                    error: "Failed to process Copilot request",
                    details: copilotError instanceof Error ? copilotError.message : String(copilotError)
                }
            };
        }
    } catch (error) {
        context.error('Request processing error:', error);
        
        return {
            status: 500,
            jsonBody: {
                error: "Internal server error",
                details: error instanceof Error ? error.message : String(error)
            }
        };
    }
}
