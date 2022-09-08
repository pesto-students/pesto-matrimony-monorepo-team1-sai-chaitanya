import { useOktaAuth } from '@okta/okta-react';
import { FormWrapper, LoginForm } from '../../components';
import { showNotification } from '@pm/pm-ui';
import './adminLogin.css';

function AdminLogin() {
  const { oktaAuth, authState } = useOktaAuth();

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
      .catch((err) => showNotification('error', 'email or password incorrect'));

  if (!authState) {
    return <div>Loading...</div>;
  }
  if (!authState.isAuthenticated) {
    return (
      <FormWrapper
        bottomText="If you have problem in login or forget password, please contact to developer!"
        formTitle="Admin Login"
        formDescription="Login to your account!"
      >
        <LoginForm onFormSubmit={loginHandler} />
      </FormWrapper>
    );
  }
}

export default AdminLogin;
