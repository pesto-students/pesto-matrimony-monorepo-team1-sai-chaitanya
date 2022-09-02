import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { PATHS } from '../constants';
import { AppSkeleton } from '../components';
import {
  Home,
  Matches,
  MailBox,
  PageNotFound,
  Profile,
  Recommendations,
  Search
} from '../pages';

function SecureRoutes() {
  return (
    <AppSkeleton>
      <Switch>
        <Route exact path={PATHS.PROFILE} component={Profile} />
        <Route exact path={PATHS.HOME} component={Home} />
        <Route exact path={PATHS.RECOMMENDATIONS} component={Recommendations} />
        <Route path={PATHS.MATCHES} component={Matches} />
        <Route path={PATHS.MAILBOX} component={MailBox} />
        <Route path={PATHS.SEARCH} component={Search} />
        <Route component={PageNotFound} />
      </Switch>
    </AppSkeleton>
  );
}

export default SecureRoutes;
