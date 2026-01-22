# Azure Functions + GitHub Copilot SDK Project

## Project Structure
- `SPFX/` - SharePoint Framework web part (browser-based)
- `azure-functions/` - Azure Functions backend for GitHub Copilot SDK

## Development Guidelines

### Azure Functions
- Use TypeScript for all function code
- Implement HTTP triggers for API endpoints
- GitHub Copilot SDK runs server-side only
- Use async/await for all Copilot SDK operations

### Environment Variables
- Store sensitive data in `local.settings.json` (gitignored)
- Use Azure Key Vault for production secrets

### Code Style
- Follow TypeScript best practices
- Use proper error handling and logging
- Return appropriate HTTP status codes

## Architecture
The SPFx web part calls the Azure Function endpoint, which uses the GitHub Copilot SDK to process requests and return responses.
