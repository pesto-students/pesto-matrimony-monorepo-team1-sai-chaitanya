import React from "react";
import { useOktaAuth } from '@okta/okta-react';


const Protected = () => {

    const { authState } = useOktaAuth();

    const token = authState.accessToken.accessToken
    console.log(token);

    return(
        <h1>This is from protected route</h1>
    )
}

export default Protected;