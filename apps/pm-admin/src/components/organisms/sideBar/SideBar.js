import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
// import { DEFAULT_SELECTED_ITEM_KEY, MENU_ITEMS } from './constants';
import { Button } from '../../atoms';
import { ProfileSummary } from '../../molecules';
import { useOktaAuth } from '@okta/okta-react';
// import { QuickInfoBar } from '../../molecules';
import { getUserProfile } from '../../../redux/actions/Actions';
import { showNotification } from '@pm/pm-ui';
import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
import styles from './sideBar.module.scss';

function SideBar() {
  const dispatch = useDispatch();

  const history = useHistory();
  const { oktaAuth, authState } = useOktaAuth();

  // console.log(authState.idToken.claims.email.jay@yopmail.com);

  //getting current user's oktaId
  const oktaUserId = authState.accessToken.claims.uid;

  useEffect(() => {
    dispatch(getUserProfile(oktaUserId));
  }, []);

  //data from redux
  const userProfileInfo = useSelector((state) => state.getUserProfileResponse.data || {});


  //logic for user logout and admin login.
  if(userProfileInfo.role === "User") {
    oktaAuth.signOut('/login');
  }

  const { images, gender } = userProfileInfo;
  var emptyArrayHolder = images ||  [];

  var imageFromServer;          

  if(gender === "female"){
    imageFromServer = emptyArrayHolder?.length === 0 ? "https://res.cloudinary.com/pesto-matrimony/image/upload/v1662458482/tufqrbcs4pnkwcukvynw.png" : images[0];
  }else{
    imageFromServer = emptyArrayHolder?.length === 0 ? "https://res.cloudinary.com/pesto-matrimony/image/upload/v1662374871/e0kfqgvenrb2mhpzya4a.png" : images[0];
  }
 
  


  const handleMenuItemClick = ({ key }) => {
    history.push(`/${key}`);
  };
  const handleRedirectToMatches = (matchStatus) => {
    history.push(`/matches/${matchStatus}`);
  };
  const logoutHandler = () => oktaAuth.signOut('/login');
  const logOutMe = () => {
    if (authState.isAuthenticated) {
      return (
        <Button onClick={logoutHandler} type="text" block>
          Logout
        </Button>
      );
    }
  };

  // "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"

  return (
    <div className={styles.container}>
      <div className={styles.profileSummary}>
        <ProfileSummary
          imageChangeLink="/edit-profile"
          userDetails={userProfileInfo.email}
          userImageSrc={imageFromServer}
          userName={userProfileInfo.name}
        />
      </div>

      {/* <div className={styles.quickInfoBarWraper}>
        <QuickInfoBar onClick={handleRedirectToMatches} />
      </div> */}

      {/* <div className={styles.menu}>
        <Menu
          defaultSelectedKeys={[DEFAULT_SELECTED_ITEM_KEY]}
          items={MENU_ITEMS}
          onClick={handleMenuItemClick}
          style={{
            borderRight: 'none',
          }}
        />
      </div> */}

      {/* <div className={styles.settings}></div> */}
      <div className={styles.logoutBtn}>{logOutMe()}</div>
    </div>
  );
}

export default SideBar;
