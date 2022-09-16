import { Security } from '@okta/okta-react';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { BrowserRouter, useHistory } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import Routes from '../routes';

// *****************Sentry Code Start*****************
Sentry.init({
  dsn: 'https://fd2308d07fca4c688c954fe1451c7e33@o1408574.ingest.sentry.io/6744195',
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// *****************Sentry Code End*****************

const oktaAuth = new OktaAuth({
  issuer: 'https://dev-42684472.okta.com/oauth2/default',
  clientId: '0oa61onsa5MnlL90C5d7',
  redirectUri: window.location.origin + '/login/callback',
});

const App = () => {
  const history = useHistory();
  const restoreOriginalUri = (_oktaAuth, originalUri) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  };

  function customAuthHandler() {
    history.push('/login');
  }

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler}>
      <Routes />
    </Security>
  );
};

const AppWithRouterAccess = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWithRouterAccess;
