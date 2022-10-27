import { useState, useEffect } from 'react';
import { UserInfoCardsList } from '../../components';
import { useOktaAuth } from '@okta/okta-react';
import axios from 'axios';
import { Empty, Spin } from 'antd';
import styles from './shortlisted.module.scss';

const baseUrl = 'https://pm-api-yr8y.onrender.com';
const oldBaseUrl = 'https://pmapi-pesto.herokuapp.com'; 

const Shortlisted = () => {
  const { authState } = useOktaAuth();
  const [shortlistedMatchesData, setShortlistedMatchesData] = useState([]);
  const [responseToCheck, setResponseToCheck] = useState({});


  //getting current user's oktaId
  const oktaUserId = authState.accessToken.claims.uid;



  // let actualShortlistedMatcheshData = [];
  useEffect(() => {
    async function fetchProfilesData() {
      const res = await axios.get(`${baseUrl}/api/v1/users/userprofile/${oktaUserId}`);
      const shortlistedUserIds = res.data.currentUser[0].shortlistedMatches;
      const userProfiles = await Promise.all(
        shortlistedUserIds.map(async (id) => {
          const response = await axios.get(`${baseUrl}/api/v1/users/userprofile/${id}`);
         
          return response.data.currentUser[0];
        })
      );
      setResponseToCheck(userProfiles); //v
      setShortlistedMatchesData(userProfiles); 
    }
    try {
      fetchProfilesData();
    } catch (err) {
      console.log(err);
    }
  }, []);

  // if (_.isEmpty(responseToCheck)) {
  //   return <Spin />;
  // }

  return (
    <div className={styles.shortlistedPage}>
    <h1 className={styles.shortlistedProfilePageHeading}>Shortlisted Profiles Page</h1>
      {shortlistedMatchesData.length < 1 ? (
        <Empty description={
      <span>
        You have not shortlisted any profile yet
      </span>
    } />
      ) : (
        <UserInfoCardsList matchesData={shortlistedMatchesData} />
      )}
    </div>
  );
};

export default Shortlisted;
