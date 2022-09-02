import { useOktaAuth } from '@okta/okta-react';
import { FormWrapper, LoginForm } from '../../components';
import styles from './login.module.scss';

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
          oktaAuth.signInWithRedirect({
            originalUri: '/',
            sessionToken,
          });
        }
      })
      .catch((err) => console.log('Error', err));

  if (!authState) {
    return <div>Loading...</div>;
  }
  if (!authState.isAuthenticated) {
    return (
      <FormWrapper
        bottomText="Don't have an account? "
        formTitle="Login"
        formDescription="Login to your account!"
        pageToRedirect="signup"
        pageToRedirectTitle="SignUp"
        sideImage="loginPage"
      >
        <LoginForm onFormSubmit={loginHandler} />
      </FormWrapper>
    );
  }
}

export default Login;
