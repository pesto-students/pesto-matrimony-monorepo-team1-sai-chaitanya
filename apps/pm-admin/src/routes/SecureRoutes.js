import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { PATHS } from '../constants';
import { AppSkeleton } from '../components';
import {
  AdminPanel,
} from '../pages';

console.log(PATHS);

function SecureRoutes() { 
  return (
    <AppSkeleton>
      <Switch>
       <Route exact path={PATHS.ADMIN} component={AdminPanel} />
        {/* <Route component={PageNotFound} /> */}
      </Switch>
    </AppSkeleton>
  );
}

export default SecureRoutes;
