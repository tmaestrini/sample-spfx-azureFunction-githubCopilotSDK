import React from "react";
import {
  Button,
  Card,
  CardHeader,
  Text,
  makeStyles,
  tokens,
  Spinner,
  Input
} from "@fluentui/react-components";
import { Send24Regular } from "@fluentui/react-icons";
import styles from '../GithubCopilotSdkSample.module.scss';

/**
 * Sample component demonstrating Copilot Client UI Send and Wait functionality.
 */

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingVerticalL,
  },
  textarea: {
    width: '100%',
  },
  responseCard: {
    minHeight: '100px',
    width: '100%',
  },
});

type CopilotClientUiSendAndWaitProps = {
  backendAPIUrl: string;
};

const CopilotClientUISendAndWait: React.FC<CopilotClientUiSendAndWaitProps> = ({ backendAPIUrl }) => {
  const [prompt, setPrompt] = React.useState<string>('');
  const [promptResponse, setPromptResponse] = React.useState<string>('Response will appear here...');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const fluentStyles = useStyles();

  const callApi = async () => {
    if (!prompt.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(backendAPIUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          model: 'claude-sonnet-4.5'
        })
      });

      const data = await response.json();
      console.log('Prompt:', prompt);
      console.log('Copilot Response:', data);
      setPromptResponse(data.content || 'No response received');
    } catch (error) {
      console.error('Error calling Copilot API:', error);
      setPromptResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.welcome}>
      <Text size={400} weight="semibold">Copilot Client UI Send and Wait Example</Text>

      <div className={fluentStyles.container}>
        <Input
          placeholder="Enter your prompt here"
          value={prompt}
          disabled={isLoading}
          onChange={(_, data) => setPrompt(data.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isLoading && prompt.trim()) {
              callApi().catch(console.error);
            }
          }}
        />

        <Button
          appearance="primary"
          icon={<Send24Regular />}
          onClick={() => callApi().catch(console.error)}
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? 'Sending...' : 'Send Prompt'}
        </Button>

        <Card className={fluentStyles.responseCard}>
          <CardHeader header={<Text weight="semibold">Response</Text>} />
          {isLoading ? (
            <Spinner label="Waiting for response..." />
          ) : (
            <Text>{promptResponse}</Text>
          )}
        </Card>
      </div>
    </div>
  );
}

export default CopilotClientUISendAndWait;