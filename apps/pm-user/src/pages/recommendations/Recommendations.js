import { UserInfoCardsList } from '../../components';
import { useOktaAuth } from '@okta/okta-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './recommendations.module.scss';

function Recommendations() {
  const { authState } = useOktaAuth();
  const [recommendations, setRecommendations] = useState([]);

  //getting current user's oktaId
  const oktaUserId = authState.accessToken.claims.uid;

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/v1/recommendations/${oktaUserId}`)
      .then((res) => {
        setRecommendations(res.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className={styles.recommendationsPage}>
      <h2>Recommendations</h2>
      {recommendations?.length < 1 ? (
        <p>No Recommendations found. Please update your profile to start getting recommendations</p>
      ) : (
        <UserInfoCardsList matchesData={recommendations} />
      )}
    </div>
  );
}

export default Recommendations;
