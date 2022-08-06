import React from "react";
import { useOktaAuth } from '@okta/okta-react';
import "./login.css";

const password = "565BHOPALkatara";
const email = "rohit@gmail.com";

const Login = () => {
    const { oktaAuth, authState } = useOktaAuth();    
  
    const login = async () => oktaAuth.signInWithCredentials({ password: password, username: email }).then((res) => {
        const { status, sessionToken } = res;
        // store.set(LOCAL_STORE.OKTA_SESSION_TOKEN, sessionToken);

        if(status === "SUCCESS"){
            if(!sessionToken){
                console.error("authentication process failed");
            }

            oktaAuth.signInWithRedirect({
                originalUri: "/",
                sessionToken
            });
        }
    });

    // const login = async () => oktaAuth.signInWithRedirect()

    const logout = async () => oktaAuth.signOut('/');
  
    if(!authState) {
      return <div>Loading...</div>;
    }
  
    if(!authState.isAuthenticated) {
      return (
        <div>
          <p>Not Logged in yet</p>
          <button onClick={login}>Login</button>
        </div>
      );
    }
  
    return (
      <div>
        <p>Logged in!</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
}

export default Login;
