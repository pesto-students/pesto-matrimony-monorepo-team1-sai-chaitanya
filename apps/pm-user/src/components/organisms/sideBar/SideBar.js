import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { DEFAULT_SELECTED_ITEM_KEY, MENU_ITEMS } from './constants';
import { Menu, Button } from '../../atoms';
import { ProfileSummary } from '../../molecules';
import { useOktaAuth } from '@okta/okta-react';
import { QuickInfoBar } from '../../molecules';
import { getUserProfile } from '../../../redux/actions/Actions';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import styles from './sideBar.module.scss';

function SideBar() {
  const dispatch = useDispatch();

  //data from redux
  const userProfileInfo = useSelector((state) => state.getUserProfileResponse.data || {});

  const history = useHistory();
  const { oktaAuth, authState } = useOktaAuth();

  //getting current user's oktaId
  const oktaUserId = authState.accessToken.claims.uid;

  useEffect(() => {
    dispatch(getUserProfile(oktaUserId));
  }, []);

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

  return (
    <div className={styles.container}>
      <div className={styles.profileSummary}>
        <ProfileSummary
          imageChangeLink="#"
          userDetails={userProfileInfo.email}
          userImageSrc="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          userName={userProfileInfo.name}
        />
      </div>
      <div className={styles.quickInfoBarWraper}>
        <QuickInfoBar onClick={handleRedirectToMatches} />
      </div>
      <div className={styles.menu}>
        <Menu
          defaultSelectedKeys={[DEFAULT_SELECTED_ITEM_KEY]}
          items={MENU_ITEMS}
          onClick={handleMenuItemClick}
          style={{
            borderRight: 'none',
          }}
        />
      </div>
      <div className={styles.settings}></div>
      <div className={styles.logoutBtn}>{logOutMe()}</div>
    </div>
  );
}

export default SideBar;
