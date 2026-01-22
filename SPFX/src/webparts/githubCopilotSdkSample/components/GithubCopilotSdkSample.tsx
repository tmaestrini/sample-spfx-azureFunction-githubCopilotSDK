import * as React from 'react';
import styles from './GithubCopilotSdkSample.module.scss';
import type { IGithubCopilotSdkSampleProps } from './IGithubCopilotSdkSampleProps';
import { escape } from '@microsoft/sp-lodash-subset';
import CopilotClientUISendAndWait from './Github Copilot/CopilotClientUISendAndWait';

export default class GithubCopilotSdkSample extends React.Component<IGithubCopilotSdkSampleProps> {
  public render(): React.ReactElement<IGithubCopilotSdkSampleProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <section className={`${styles.githubCopilotSdkSample} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.welcome}>
          <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} />
          <h2>Well done, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div>Web part property value: <strong>{escape(description)}</strong></div>
        </div>
        <div>
          <CopilotClientUISendAndWait />
        </div>
      </section>
    );
  }
}
