import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { LoginCallback, SecureRoute } from '@okta/okta-react';

import { PATHS } from '../constants';
import SecureRoutes from './SecureRoutes';
import { Faq, ForgotPassword, Login, SignUp } from '../pages';

function Routes() {
  return (
    <Switch>
      <Route exact path={PATHS.FORGOT_PASSWORD} component={ForgotPassword} />
      <Route exact path={PATHS.LOGIN} component={Login} />
      <Route exact path={PATHS.SIGNUP} component={SignUp} />
      <Route exact path={PATHS.FAQ} component={Faq} />
      <Route exact path={PATHS.LOGIN_CALLBACK} component={LoginCallback} />
      <SecureRoute path="*" component={SecureRoutes} />
      {/* <Route path="*" component={SecureRoutes} /> */}
    </Switch>
  );
}

export default Routes;
