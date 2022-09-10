import React from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { LoginCallback, SecureRoute } from '@okta/okta-react';
import { Security } from '@okta/okta-react';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';

import { PATHS } from '../constants';
import AdminSecureRoutes from './AdminSecureRoutes';
import { AdminLogin, AdminPanel } from '../pages';

const oktaAuth = new OktaAuth({
  issuer: 'https://dev-42684472.okta.com/oauth2/default',
  clientId: '0oa6g3qn4g4KobYzB5d7',
  redirectUri: window.location.origin + '/login/callback',
});

function AdminRoutes() {

  const history = useHistory();
  const restoreOriginalUri = (_oktaAuth, originalUri) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  };

  function customAuthHandler() {
    history.push('/admin-login');
  }


  
console.log(AdminPanel);
  return (
    <Security
    oktaAuth={oktaAuth}
      restoreOriginalUri={restoreOriginalUri}
      onAuthRequired={customAuthHandler}
    >
    <Switch>
      <Route  path={PATHS.ADMIN_LOGIN} component={AdminLogin} />
      <Route  path={PATHS.LOGIN_CALLBACK} component={LoginCallback} />
      <SecureRoute path="*" component={AdminSecureRoutes} />
    </Switch>
    </Security>
  );
}

export default AdminRoutes;
