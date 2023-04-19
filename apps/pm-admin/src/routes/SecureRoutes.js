import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { PATHS } from '../constants';
import { AppSkeleton } from '../components';
import {
  AdminPanel
} from '../pages';

function SecureRoutes() { 
  return (
    <AppSkeleton>
      <Switch>
        <Route exact path="/adminpanel" component={AdminPanel} />
      </Switch>
    </AppSkeleton>
  );
}

export default SecureRoutes;
