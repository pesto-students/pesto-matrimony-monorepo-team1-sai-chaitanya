import { useOktaAuth } from '@okta/okta-react';
import { LoginForm, Button } from '../../components';
import styles from './login.module.scss';

const Login = () => {
  const { oktaAuth, authState } = useOktaAuth();

  const loginHandler = (password, email) =>
    oktaAuth
      .signInWithCredentials({ password: password, username: email })
      .then((res) => {
        const { status, sessionToken } = res;
        // store.set(LOCAL_STORE.OKTA_SESSION_TOKEN, sessionToken);
        if (status === 'SUCCESS') {
          if (!sessionToken) {
            console.error('authentication process failed');
          }
          oktaAuth.signInWithRedirect({
            originalUri: '/',
            sessionToken,
          });
        }
      });

  const logoutHandler = () => oktaAuth.signOut('/');

  if (!authState) {
    return <div>Loading...</div>;
  }

  if (!authState.isAuthenticated) {
    return (
      <div className={styles.superContainer}>
        <div className={styles.leftContainer}></div>
        <div className={styles.rightContainer}>
          <div className={styles.loginBox}>
            <div className={styles.logInLogo}>Pesto Matrimony</div>
            <div className={styles.signInText}>Sign in</div>
            <LoginForm onLogin={loginHandler} />
            <p className={styles.paragraph}>Forgot Password</p>
            <p className={styles.paragraph}>
              Don't have an account? <span className={styles.link}>SignUp</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p>Logged in!</p>
      <Button onClick={logoutHandler}>Logout</Button>
    </div>
  );
};

export default Login;
