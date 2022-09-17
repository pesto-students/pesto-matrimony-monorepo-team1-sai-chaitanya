import { Security } from '@okta/okta-react';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { BrowserRouter, useHistory } from 'react-router-dom';
// import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import Routes from '../routes';

// *****************Sentry Code Start*****************
// Sentry.init({
//   dsn: 'https://8421c57f8e414c5db7b180e319d44e12@o1408574.ingest.sentry.io/6744247',
//   integrations: [new BrowserTracing()],

//   // Set tracesSampleRate to 1.0 to capture 100%
//   // of transactions for performance monitoring.
//   // We recommend adjusting this value in production
//   tracesSampleRate: 1.0,
// });

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
