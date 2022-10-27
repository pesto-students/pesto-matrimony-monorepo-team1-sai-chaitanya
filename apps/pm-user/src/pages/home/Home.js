import { useOktaAuth } from '@okta/okta-react';

const Home = () => {
  const { oktaAuth, authState } = useOktaAuth();
  const loginHandler = () => oktaAuth.signInWithRedirect();
  const logoutHandler = () => oktaAuth.signOut('/');

  if (!authState) {
    return <div>Loading...</div>;
  }

  if (!authState.isAuthenticated) {
    return (
      <div>
        <p>Not Logged in yet</p>
        <button onClick={loginHandler}>Login</button>
        <Button onClick={loginHandler}>LoginStuff</Button>
      </div>
    );
  }

  return (
    <div>
      <p>Logged in!</p>
      <button onClick={logoutHandler}>Logout</button>
    </div>
  );
};

export default Home;
