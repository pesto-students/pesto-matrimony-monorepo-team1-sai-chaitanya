import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { DEFAULT_SELECTED_ITEM_KEY, MENU_ITEMS } from './constants';
import { Menu, Button } from '../../atoms';
import { ProfileSummary } from '../../molecules';
import { useOktaAuth } from '@okta/okta-react';
import { QuickInfoBar } from '../../molecules';
import { getUserProfileForSideBar } from '../../../redux/actions/Actions';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { useParams, useLocation } from 'react-router-dom';
import { Spin, Skeleton } from 'antd';
import styles from './sideBar.module.scss';
import { HomeOutlined, MailOutlined, SearchOutlined, UnorderedListOutlined, UserOutlined } from '../../atoms';

function SideBar() {
  const dispatch = useDispatch();
  const  location  = useParams();

  const history = useHistory();
  const { oktaAuth, authState } = useOktaAuth();

  //getting current user's oktaId
  const oktaUserId = authState.accessToken.claims.uid;

  useEffect(() => {
    dispatch(getUserProfileForSideBar(oktaUserId));
  }, []);

  //data from redux
  const userProfileInfo = useSelector((state) => state.getUserProfileForSideBarReducer.data || {});
  // const userProfileInfo = {}; //to check load skelaton


  const { images, gender } = userProfileInfo;
  var emptyArrayHolder = images || [];

  var imageFromServer;

  if (gender === 'female') {
    imageFromServer =
      emptyArrayHolder?.length === 0
        ? 'https://res.cloudinary.com/pesto-matrimony/image/upload/v1662458482/tufqrbcs4pnkwcukvynw.png'
        : images[0];
  } else {
    imageFromServer =
      emptyArrayHolder?.length === 0
        ? 'https://res.cloudinary.com/pesto-matrimony/image/upload/v1662374871/e0kfqgvenrb2mhpzya4a.png'
        : images[0];
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

  

  const MENU_ITEMS = [
    {
      key: 'recommendations',
      icon: <HomeOutlined />,
      label: 'Recommendations',
    },
    {
      key: `profile/${oktaUserId}`,
      icon: <UserOutlined />,
      label: 'MyProfile',
    },
    {
      key: 'shortlisted',
      icon: <UnorderedListOutlined />,
      label: 'Shortlisted',
    },
    {
      key: 'search',
      icon: <SearchOutlined />,
      label: 'Search',
    },

    {
      key: 'mailbox',
      icon: <MailOutlined />,
      label: 'MailBox',
    },
  ];
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
