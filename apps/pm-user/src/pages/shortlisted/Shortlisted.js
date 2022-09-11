import { useState, useEffect } from 'react';
import { UserInfoCardsList } from '../../components';
import { useOktaAuth } from '@okta/okta-react';
import axios from 'axios';
import styles from './shortlisted.module.scss';

const Shortlisted = () => {
  const { authState } = useOktaAuth();
  const [shortlistedMatchesData, setShortlistedMatchesData] = useState([]);

  //getting current user's oktaId
  const oktaUserId = authState.accessToken.claims.uid;

  // let actualShortlistedMatcheshData = [];
  useEffect(() => {
    async function fetchProfilesData() {
      const res = await axios.get(`https://pmapi-pesto.herokuapp.com/api/v1/users/userprofile/${oktaUserId}`);
      const shortlistedUserIds = res.data.currentUser[0].shortlistedMatches;
      const userProfiles = await Promise.all(
        shortlistedUserIds.map(async (id) => {
          const response = await axios.get(`https://pmapi-pesto.herokuapp.com/api/v1/users/userprofile/${id}`);
          return response.data.currentUser[0];
        })
      );
      setShortlistedMatchesData(userProfiles);
    }
    try {
      fetchProfilesData();
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <div className={styles.shortlistedPage}>
      <h2>Shortlisted Profiles</h2>
      {shortlistedMatchesData.length < 1 ? (
        <p>There are no shortlisted matches.</p>
      ) : (
        <UserInfoCardsList matchesData={shortlistedMatchesData} />
      )}
    </div>
  );
};

export default Shortlisted;
