import { useOktaAuth } from '@okta/okta-react';
import { FormWrapper, LoginForm } from '../../components';
import { showNotification } from '@pm/pm-ui';
import './login.css';

function Login() {
  const { oktaAuth, authState } = useOktaAuth();

  // console.log(authState?.accessToken.claims);

  //login hander
  const loginHandler = (password, email) =>
    oktaAuth
      .signInWithCredentials({ password: password, username: email })
      .then((res) => {
        const { status, sessionToken } = res;
        if (status === 'SUCCESS') {
          if (!sessionToken) {
            console.error('authentication process failed');
          }
          console.log(authState);
          oktaAuth.signInWithRedirect({
            originalUri: '/adminpanel',
            sessionToken,
          });
        }
      })
      .catch((err) => {
        showNotification('error', 'email or password incorrect');
      });

  if (!authState) {
    return <div>Loading...</div>;
  }
  if (!authState.isAuthenticated) {
    return (
      <FormWrapper
        bottomText="This is Admin Login Panel"
        formTitle="Admin Login"
        formDescription="Login to your account!"
      >
        <LoginForm onFormSubmit={loginHandler} />
      </FormWrapper>
    );
  }
}

export default Login;
