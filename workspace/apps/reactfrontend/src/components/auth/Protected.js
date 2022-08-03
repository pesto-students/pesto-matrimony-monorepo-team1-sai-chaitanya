import React, { useState, useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import axios from 'axios';

const Protected = () => {
  <h3 id="protected">Protected</h3>
  const [accessToken, setAccessToken] = useState();
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if(accessToken){
      apiCall();
    }
  }, [accessToken]);

  useEffect(() => {
    if (!authState || !authState.isAuthenticated) {
      // When user isn't authenticated, forget any user info
      setUserInfo(null);
    } else {
        const AccessToken = oktaAuth.tokenManager.get('accessToken').then((data)=>{
            setAccessToken(data.accessToken);
        });
      oktaAuth.getUser().then((info) => {
        setUserInfo(info);
      }).catch((err) => {
        console.error(err);
      });
    }
  }, [authState, oktaAuth]); // Update if authState changes

  // console.log("AcTkn", accessToken);

  if (!userInfo) {
    return (
      <div>
        <p>Fetching user info ...</p>
      </div>
    );
  }
  async function apiCall(){
    try{
      var response = await axios.get("http://localhost:3001/api/whoami", {
        headers: {
                    Accept: "application/json",
                    Authorization: 'Bearer '+accessToken,
                    "Content-Type": "application/json"
                }
    });
    console.log(response);
    }catch(err){
      console.log("error", err);
    }
  }
  return (
    <div>
      <div>
        <p id="welcome">
          Welcome, &nbsp;{userInfo.name}!
        </p>
        <p>You have successfully authenticated against your Okta org, and have been redirected back to this application.</p>
      </div>
    </div>
  );
};

export default Protected;