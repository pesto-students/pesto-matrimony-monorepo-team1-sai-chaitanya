import { SecureRoute, Security, LoginCallback } from '@okta/okta-react';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom';
import { Protected, Login } from '../pages';
import { Header } from '../components';
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

  return (
    <Router>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
        <Header />
        <Route path="/login" exact={true} component={Login} />
        <SecureRoute path="/protected" component={Protected} />
        <Route path="/login/callback" component={LoginCallback} />
      </Security>
    </Router>
  );
};

export default App;
