import { UserInfoCardsList } from '../../components';
import { useOktaAuth } from '@okta/okta-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './recommendations.module.scss';

function Recommendations() {
  const { authState } = useOktaAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [userInfo, setuserInfo] = useState({});

  //getting current user's oktaId
  const oktaUserId = authState.accessToken.claims.uid;

  useEffect(() => {
    axios
      .get(`https://pmapi-pesto.herokuapp.com/api/v1/recommendations/${oktaUserId}`)
      .then((res) => {
        setRecommendations(res.data.data);
        setuserInfo(res.data.data[0]);
      })
      .catch((err) => console.log(err));
  }, []);

  console.log(userInfo.oktaUserId);

  const userId = userInfo.oktaUserId;

  function sendUserId(userId) {
    return userId;
  }

  return (
    <div className={styles.recommendationsPage}>
      <h2>Recommendations</h2>
      {recommendations?.length < 1 ? (
        <p>No Recommendations found. Please update your profile to start getting recommendations</p>
      ) : (
        <>
          <UserInfoCardsList matchesData={recommendations} cardSelfUserIdHandle={() => sendUserId(userId)} />
        </>
      )}
    </div>
  );
}

export default Recommendations;
