import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '../../../../../../libs/pm-ui/src/lib/components';
import { ProfileSummary } from '../../molecules';
import { useOktaAuth } from '@okta/okta-react';
import { getUserProfile } from '../../../../../pm-user/src/redux/actions/Actions';
import { useDispatch, useSelector } from 'react-redux';
import styles from './sideBar.module.scss';

function SideBar() {
  const dispatch = useDispatch();

  const history = useHistory();
  const { oktaAuth, authState } = useOktaAuth();

  //getting current user's oktaId
  const oktaUserId = authState.accessToken.claims.uid;

  useEffect(() => {
    dispatch(getUserProfile(oktaUserId));
  }, []);

  

  //data from redux
  const userProfileInfo = useSelector((state) => state.getUserProfileResponse.data || {});

  const { images, gender } = userProfileInfo;
  var emptyArrayHolder = images ||  [];

  console.log(userProfileInfo);

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
      <div className={styles.logoutBtn}>{logOutMe()}</div>
    </div>
  );
}

export default SideBar;
