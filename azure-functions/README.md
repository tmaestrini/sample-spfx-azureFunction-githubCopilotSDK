# Azure Functions - GitHub Copilot SDK Backend

This Azure Functions project provides a serverside backend for integrating GitHub Copilot SDK with the SPFx web part.

## Prerequisites

Make sure you use the Node.js programming model along with [its supported dependencies and versions]([https://](https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-node?tabs=typescript%2Cwindows%2Cazure-cli&pivots=nodejs-model-v4#supported-versions)):

- [Node.js](https://nodejs.org/) v18 or higher (22.x 20.x)
- [Azure Functions Core Tools](https://learn.microsoft.com/azure/azure-functions/functions-run-local) v4.x
- GitHub Copilot access

## Project Structure

```
azure-functions/
├── src/
│   └── functions/
│       ├── copilotChat.ts          # Simple request/response endpoint
│       └── copilotChatStream.ts    # Alternative endpoint
├── host.json                        # Azure Functions host configuration
├── local.settings.json              # Local development settings (gitignored)
├── package.json                     # npm dependencies
└── tsconfig.json                    # TypeScript configuration
```

## Getting Started

### 1. Install Dependencies

```bash
cd azure-functions
npm install
```

### 2. Build the Project

```bash
npm run build
```

### 3. Run Locally

```bash
npm start
```

The functions will be available at:

- **POST** `http://localhost:7071/api/copilot-chat`
- **POST** `http://localhost:7071/api/copilot-chat-stream`

## API Endpoints

### POST `/api/copilot-chat`

Sends a prompt to GitHub Copilot and returns the response, depending on the model of your choice (and your subscription).
Example:

**Request Body:**

```json
{
  "prompt": "What is 2 + 2?",
  "model": "gpt-4o"
}
```

**Response:**

```json
{
  "content": "2 + 2 equals 4.",
  "model": "gpt-4o",
  "timestamp": "2026-01-22T22:43:00.000Z"
}
```

### POST `/api/copilot-chat-stream`

Alternative endpoint (currently uses sendAndWait, can be extended for streaming).

## Testing with cURL

```bash
curl -X POST http://localhost:7071/api/copilot-chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explain Azure Functions in one sentence"}'
```

## Deployment to Azure

### Using Azure CLI

1. Create a Function App:

```bash
az functionapp create \
  --resource-group <resource-group-name> \
  --consumption-plan-location <location> \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --name <function-app-name> \
  --storage-account <storage-account-name>
```

1. Deploy the function:

```bash
func azure functionapp publish <function-app-name>
```

### Using VS Code

1. Install the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
2. Click the Azure icon in the sidebar
3. Sign in to your Azure account
4. Deploy to Function App

## Configuration

### CORS Settings

For production, update [local.settings.json](local.settings.json) to restrict CORS:

```json
{
  "Host": {
    "CORS": "https://yourtenant.sharepoint.com",
    "CORSCredentials": true
  }
}
```

In Azure Portal, configure CORS under **Function App → CORS** settings.

## Security

- **Authentication**: Set `authLevel` to `function` or `admin` in production
- **API Keys**: Store sensitive keys in Azure Key Vault
- **CORS**: Restrict to your SharePoint tenant domain

## Integration with SPFx

Update your SPFx web part to call the Azure Function:

```typescript
const response = await fetch('https://<your-function-app>.azurewebsites.net/api/copilot-chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    prompt: 'Your prompt here',
    model: 'gpt-4o'
  })
});

const data = await response.json();
// process the response data
```

## Development Scripts

- `npm run build` - Compile TypeScript
- `npm run watch` - Watch mode for development
- `npm start` - Start Azure Functions locally
- `npm run clean` - Remove build artifacts

## Troubleshooting

### Module not found errors

Ensure `"type": "module"` is in package.json for ESM support.

### CORS errors

Configure CORS in `local.settings.json` or the Azure Portal.

### GitHub Copilot SDK errors

Verify GitHub Copilot access and API availability.

## Learn More

- [Azure Functions Documentation](https://learn.microsoft.com/azure/azure-functions/)
- [GitHub Copilot SDK](https://github.com/github/copilot-sdk)
- [TypeScript in Azure Functions](https://learn.microsoft.com/azure/azure-functions/functions-reference-node?tabs=typescript)
