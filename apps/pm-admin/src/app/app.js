import { Security } from '@okta/okta-react';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { BrowserRouter, useHistory } from 'react-router-dom';
import AdminRoutes from '../adminRoutes';


const App = () => {
  return (
    <BrowserRouter>
        <AdminRoutes />
    </BrowserRouter>
  );
};

export default App;
