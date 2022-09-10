import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { PATHS } from '../constants';
import { AppSkeleton } from '../components';
import {
  AdminPanel,
} from '../pages';



function AdminSecureRoutes() { 
  return (
    <AppSkeleton>
      <Switch>
       <Route exact path={PATHS.ADMIN} component={AdminPanel} />
        {/* <Route component={PageNotFound} /> */}
      </Switch>
    </AppSkeleton>
  );
}

export default AdminSecureRoutes;
