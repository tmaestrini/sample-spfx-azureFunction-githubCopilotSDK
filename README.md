# GitHub Copilot SDK - SPFx & Azure Functions

This repository demonstrates how to integrate [GitHub Copilot SDK](https://github.com/github/copilot-sdk) with SharePoint Framework (SPFx) using Azure Functions as a backend.

## Project Structure

```
├── SPFX/                           # SharePoint Framework web part (browser)
├── azure-functions/                # Azure Functions backend (Node.js)
│   ├── src/functions/
│   │   ├── copilotChat.ts         # HTTP trigger for Copilot
│   │   └── copilotChatStream.ts   # Alternative endpoint
│   └── README.md
└── .github/
    └── copilot-instructions.md    # Workspace instructions
```

## Why This Architecture?

The **GitHub Copilot SDK** is a **Node.js-only** library and cannot run in the browser. SPFx web parts run in the browser, so we need a server-side component to handle Copilot SDK calls.

**Solution**: Azure Functions provides a serverless backend that:

- Runs the Copilot SDK in a Node.js environment
- Exposes HTTP endpoints for the SPFx web part to call
- Scales automatically based on demand

## Quick Start

### 1. Azure Functions Backend

```bash
cd azure-functions
npm install
npm run build
npm start
```

Functions available at:
- `http://localhost:7071/api/copilot-chat`
- `http://localhost:7071/api/copilot-chat-stream`

See [azure-functions/README.md](azure-functions/README.md) for details.

### 2. SPFx Web Part

```bash
cd SPFX
npm install
heft start
```

>[!NOTE]
> The current SPFx implementation (web part) needs to be updated to **call an authenticated Azure Function endpoint (recommended!)** trying to use the Copilot SDK.

## Usage Example

**Call the Azure Function from your SPFx web part:**

```typescript
const callCopilot = async (prompt: string) => {
  const response = await fetch('http://localhost:7071/api/copilot-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, model: 'gpt-4o' })
  });
  
  const data = await response.json();
  return data.content;
};
```

## Deployment

### Azure Functions
```bash
cd azure-functions
func azure functionapp publish <your-function-app-name>
```

### SPFx Web Part
```bash
cd SPFX
heft build --clean
heft package-solution --production
```

Upload the `.sppkg` file to your SharePoint App Catalog.

## Security Considerations

- **CORS**: Configure CORS to only allow requests from your SharePoint tenant
- **Authentication**: Use Azure AD or function keys for production
- **API Keys**: Store secrets in Azure Key Vault

## Learn More

- [Azure Functions Documentation](https://learn.microsoft.com/azure/azure-functions/)
- [SharePoint Framework](https://learn.microsoft.com/sharepoint/dev/spfx/sharepoint-framework-overview)
- [GitHub Copilot SDK](https://github.com/github/copilot-sdk)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
