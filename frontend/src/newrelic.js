// New Relic Browser Agent Configuration
import { BrowserAgent } from '@newrelic/browser-agent/loaders/browser-agent';

// Configuration from environment variables (secure)
// These values are injected at build time from .env file
const options = {
  init: {
    distributed_tracing: { enabled: true },
    performance: { capture_measures: true },
    privacy: { cookies_enabled: true },
    ajax: { deny_list: ['bam.nr-data.net'] },
  },
  info: {
    beacon: 'bam.nr-data.net',
    errorBeacon: 'bam.nr-data.net',
    licenseKey: process.env.REACT_APP_NEW_RELIC_LICENSE_KEY,
    applicationID: process.env.REACT_APP_NEW_RELIC_APPLICATION_ID,
    sa: 1,
  },
  loader_config: {
    accountID: process.env.REACT_APP_NEW_RELIC_ACCOUNT_ID,
    trustKey: process.env.REACT_APP_NEW_RELIC_TRUST_KEY,
    agentID: process.env.REACT_APP_NEW_RELIC_AGENT_ID,
    licenseKey: process.env.REACT_APP_NEW_RELIC_LICENSE_KEY,
    applicationID: process.env.REACT_APP_NEW_RELIC_APPLICATION_ID,
  },
};

// Validate configuration before initializing
if (!options.info.licenseKey || !options.info.applicationID) {
  console.warn(
    'New Relic Browser Agent: Missing required environment variables. Please check your .env file.',
  );
} else {
  // Initialize the agent
  new BrowserAgent(options);
}

export default options;
