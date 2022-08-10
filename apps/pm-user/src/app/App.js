import { SecureRoute, Security, LoginCallback } from '@okta/okta-react';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Route, useHistory } from 'react-router-dom';
import { Protected, Login } from '../pages';
import { Header, InfoSummaryCard, OwnProfileSummaryCard } from '../components';
import styles from './App.module.scss';

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
      <Header />
      <Route path="/login" exact={true} component={Login} />
      <SecureRoute path="/protected" component={Protected} />
      <Route path="/login/callback" component={LoginCallback} />
    </Security>
  );
};

export default App;
