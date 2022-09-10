import { UserInfoCardsList } from '../../components';
import { useOktaAuth } from '@okta/okta-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Recommendations() {
  const { authState } = useOktaAuth();
  const [recommendations, setRecommendations] = useState([]);

  //getting current user's oktaId
  const oktaUserId = authState.accessToken.claims.uid;

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/v1/recommendations/${oktaUserId}`)
      .then((res) => {
        console.log(res.data.data);
        setRecommendations(res.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // return <div>Recommendations</div>;
  return (
    <>
      {recommendations.length < 1 ? (
        <p>No Recommendations found. Please update your profile to start getting recommendtations</p>
      ) : (
        <UserInfoCardsList matchesData={recommendations} />
      )}
    </>
  );
}

export default Recommendations;
