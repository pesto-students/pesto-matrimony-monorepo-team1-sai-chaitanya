import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { LoginCallback, SecureRoute } from '@okta/okta-react';

import { PATHS } from '../constants';
import SecureRoutes from './SecureRoutes';
import { Login } from '../pages';

function Routes() {
  return (
    <Switch>
      <Route exact path={PATHS.LOGIN} component={Login} />
      <Route exact path={PATHS.LOGIN_CALLBACK} component={LoginCallback} />
      <SecureRoute path="*" component={SecureRoutes} />
      {/* <Route path="*" component={SecureRoutes} /> */}
    </Switch>
  );
}

export default Routes;
