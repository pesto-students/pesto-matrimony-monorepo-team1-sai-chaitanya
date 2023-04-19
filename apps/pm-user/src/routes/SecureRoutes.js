import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { PATHS } from '../constants';
import { AppSkeleton } from '../components';
import {
  Home,
  Matches,
  MailBox,
  PageNotFound,
  ProfileOthers,
  Profile,
  Recommendations,
  Search,
  EditProfilePage,
  Shortlisted
} from '../pages';

function SecureRoutes() { 
  return (
    <AppSkeleton>
      <Switch>
        <Route exact path={PATHS.PROFILE} component={Profile} />
        <Route exact path={PATHS.PROFILE_OTHERS} component={ProfileOthers} />
        <Route exact path={PATHS.EDIT_PROFILE} component={EditProfilePage} />
        <Route exact path={PATHS.SHORTLISTED} component={Shortlisted} />
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
