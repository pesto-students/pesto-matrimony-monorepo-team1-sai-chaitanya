import React from "react";
import { useOktaAuth } from "@okta/okta-react";
import "./login.css";
import FormLogin from "../formlogin";

const Login = () => {
  const { oktaAuth, authState } = useOktaAuth();

  const login = async (password, email) =>
    oktaAuth
      .signInWithCredentials({ password: password, username: email })
      .then((res) => {
        const { status, sessionToken } = res;
        // store.set(LOCAL_STORE.OKTA_SESSION_TOKEN, sessionToken);

        if (status === "SUCCESS") {
          if (!sessionToken) {
            console.error("authentication process failed");
          }

          oktaAuth.signInWithRedirect({
            originalUri: "/",
            sessionToken,
          });
        }
      });

  const logout = async () => oktaAuth.signOut("/");

  if (!authState) {
    return <div>Loading...</div>;
  }

  if (!authState.isAuthenticated) {
    return (
      <div>
        <FormLogin onLogin={login} on />
      </div>
    );
  }

  return (
    <div>
      <p>Logged in!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Login;
