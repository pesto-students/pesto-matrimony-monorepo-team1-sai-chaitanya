import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { PATHS } from '../constants';
import { AppSkeleton } from '../components';
import { Home, PageNotFound, Profile, Recommendations } from '../pages';

function SecureRoutes() {
  return (
    <AppSkeleton>
      <Switch>
        <Route exact path={PATHS.PROFILE} component={Profile} />
        <Route exact path={PATHS.HOME} component={Home} />
        <Route exact path={PATHS.RECOMMENDATIONS} component={Recommendations} />
        <Route component={PageNotFound} />
      </Switch>
    </AppSkeleton>
  );
}

export default SecureRoutes;
