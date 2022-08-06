import { SecureRoute, Security, LoginCallback } from "@okta/okta-react";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import { BrowserRouter as Router, Route, useHistory } from "react-router-dom";
import Protected from "./Protected";
import { FormLogin, HomeSignup, Login } from "./pages";
import "./App.css";

const oktaAuth = new OktaAuth({
  issuer: "https://dev-42684472.okta.com/oauth2/default",
  clientId: "0oa61onsa5MnlL90C5d7",
  redirectUri: window.location.origin + "/login/callback",
});

const App = () => {
  const history = useHistory();
  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    history.replace(toRelativeUrl(originalUri || "/", window.location.origin));
  };

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      <Route path="/login" exact={true} component={Login} />
      <Route path="/" exact={true} component={HomeSignup} />
      <Route path="/aboutus" exact={true} component={FormLogin} />
      <SecureRoute path="/protected" component={Protected} />
      <Route path="/login/callback" component={LoginCallback} />
    </Security>
  );
};

const AppWithRouterAccess = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouterAccess;
