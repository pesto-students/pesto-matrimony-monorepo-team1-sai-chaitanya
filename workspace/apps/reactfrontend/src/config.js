export default {
    oidc: {
      issuer: 'https://dev-42684472.okta.com/oauth2/default',
      clientId: '0oa61onsa5MnlL90C5d7', 
      scopes: ['openid', 'profile', 'email'],
      redirectUri: `${window.location.origin}/login/callback`
    },
    widget: {
      issuer: 'https://dev-42684472.okta.com/oauth2/default',
      clientId: '0oa61onsa5MnlL90C5d7',
      redirectUri: `${window.location.origin}/login/callback`,
      scopes: ['openid', 'profile', 'email'],
      useInteractionCodeFlow: true
    }
  };