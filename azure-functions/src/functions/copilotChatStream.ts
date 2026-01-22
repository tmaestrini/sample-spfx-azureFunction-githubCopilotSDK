import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CopilotClient } from "@github/copilot-sdk";

/**
 * Azure Function HTTP trigger for streaming Copilot responses
 * Accepts a prompt and streams the Copilot response
 */
export async function copilotChatStream(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('HTTP streaming trigger function processing a request.');

    try {
        // Parse request body
        const body = await request.json() as { prompt?: string; model?: string };
        const prompt = body?.prompt;
        const model = body?.model || "gpt-4o";

        // Validate input
        if (!prompt) {
            return {
                status: 400,
                jsonBody: {
                    error: "Missing 'prompt' in request body"
                }
            };
        }

        context.log(`Processing streaming prompt: ${prompt.substring(0, 50)}...`);

        // Initialize Copilot Client
        const client = new CopilotClient();
        
        try {
            // Create session with specified model
            const session = await client.createSession({ model });
            
            // Send prompt and get complete response
            const response = await session.sendAndWait({ prompt });
            
            // Stop the client
            await client.stop();

            // Return complete response
            return {
                status: 200,
                jsonBody: {
                    content: response?.data.content,
                    model: model,
                    timestamp: new Date().toISOString()
                }
            };
        } catch (copilotError) {
            context.error('Copilot SDK streaming error:', copilotError);
            
            // Ensure client is stopped
            try {
                await client.stop();
            } catch (stopError) {
                context.error('Error stopping client:', stopError);
            }
            
            return {
                status: 500,
                jsonBody: {
                    error: "Failed to process streaming Copilot request",
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
