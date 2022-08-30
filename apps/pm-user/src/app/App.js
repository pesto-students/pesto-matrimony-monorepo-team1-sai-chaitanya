import { Security } from '@okta/okta-react';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { BrowserRouter, useHistory } from 'react-router-dom';

import Routes from '../routes';

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
    <Security
      oktaAuth={oktaAuth}
      restoreOriginalUri={restoreOriginalUri}
      onAuthRequired={customAuthHandler}
    >
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
