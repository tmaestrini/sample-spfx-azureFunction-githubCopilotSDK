# Azure Functions + GitHub Copilot SDK Project

## Project Structure
- `SPFX/` - SharePoint Framework web part (browser-based)
- `azure-functions/` - Azure Functions backend for GitHub Copilot SDK

## Development Guidelines

### SharePoint Framework (SPFx)
- Use React and TypeScript for the web part
- Use modern React hooks and functional components
- Manage state with React's `useState` and `useEffect`
- Handle responses and display in the UI by using React state management
- Use Fluent UI for consistent styling
- Call Azure Function endpoints for Copilot interactions by using `fetch`

### Azure Functions
- Use TypeScript for all function code
- Implement HTTP triggers for API endpoints
- GitHub Copilot SDK runs server-side only
- Use async/await for handling asynchronous operations / Copilot SDK operations

#### Environment Variables
- Store sensitive data in `local.settings.json` (gitignored)
- Use Azure Key Vault for production secrets

### Code Style
- Follow TypeScript best practices
- Modularize components by functionality (for UI and backend)
- Use proper error handling and logging
- Return appropriate HTTP status codes
- Always use error handling with try/catch blocks

## Architecture
The SPFx web part calls the Azure Function endpoint, which uses the GitHub Copilot SDK to process requests and return responses.
