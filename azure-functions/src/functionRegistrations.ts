import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { copilotChat } from "./functions/copilotChat.js";
import { copilotChatStream } from "./functions/copilotChatStream.js";
import { checkForApiKey, middleware } from "./middleware/middleware.js";

/**
 * Central function registration
 * All Azure Functions are registered here
 */

// Register copilot-chat function
app.http('copilot-chat', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: middleware(copilotChat),
});

// Register copilot-chat-stream function
app.http('copilot-chat-stream', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: middleware(copilotChatStream, [checkForApiKey]),
});
