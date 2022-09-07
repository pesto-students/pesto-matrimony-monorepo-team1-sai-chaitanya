import { useOktaAuth } from '@okta/okta-react';
import { FormWrapper, LoginForm } from '../../components';
// import { showNotification } from '@pm/pm-ui';
import styles from './login.module.scss';

function AdminLogin() {
  const { oktaAuth, authState } = useOktaAuth();

  console.log(authState);
  console.log(oktaAuth);

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
            originalUri: '/admin-panel',
            sessionToken,
          });
        }
      })
      .catch((err) => console.log(err));
      // showNotification('error', 'email or password incorrect')

  if (!authState) {
    return <div>Loading...</div>;
  }
  if (!authState.isAuthenticated) {
    return (
      <FormWrapper
        bottomText="If have problem in login contact developer!"
        formTitle="Admin Login"
        formDescription="Login to your account!"
      >
        <LoginForm onFormSubmit={loginHandler} />
      </FormWrapper>
    );
  }
}

export default AdminLogin;
