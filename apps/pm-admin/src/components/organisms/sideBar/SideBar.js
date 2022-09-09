import { ProfileSummary } from '../../molecules';
import { useOktaAuth } from '@okta/okta-react';

import './sideBar.css';

function SideBar() {

  const { oktaAuth, authState } = useOktaAuth();

  console.log(oktaAuth, authState)

  
  const logoutHandler = () => oktaAuth.signOut('/admin-login');
  const logOutMe = () => {
    if (authState.isAuthenticated) {
      return (
        <button onClick={logoutHandler} type="text" block>
          Logout
        </button>
      );
    }
  };

  return (<>
    <div className="container">
      <div className="profileSummary">
        <ProfileSummary userDetails="Admin is Logged in" userName="Vinit Sharma" />
      </div>
    </div>
    <div className="hoho">{logOutMe()}</div>
    </>
  );
}

export default SideBar;
