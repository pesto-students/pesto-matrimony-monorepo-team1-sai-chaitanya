import { UserInfoCardsList } from '../../components';
import { useOktaAuth } from '@okta/okta-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Empty, Spin } from 'antd';
import _ from "lodash";
import styles from './recommendations.module.scss';

const baseUrl = 'https://pm-api-yr8y.onrender.com';
const oldBaseUrl = 'https://pmapi-pesto.herokuapp.com'; 

function Recommendations() {
  const { authState } = useOktaAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [response, setResponse] = useState({});
  const [userInfo, setuserInfo] = useState({});

  //getting current user's oktaId
  const oktaUserId = authState.accessToken.claims.uid;

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/v1/recommendations/${oktaUserId}`)
      .then((res) => {
        setRecommendations(res.data.data);
        setResponse(res);
        setuserInfo(res.data.data[0]);
      })
      .catch((err) => console.log(err));
  }, []);

  //loader
  if(_.isEmpty(response)){
    return (<div>
     <h2 className={styles.pageHeading}>Recommendations</h2>
      <Spin className={styles.pageLoaderSpin} size="large" />
    </div>)
  }

  return (
    <div className={styles.recommendationsPage}>
      <h2 className={styles.pageHeading}>Recommendations</h2>
      {recommendations?.length < 1 ? (
        <Empty
          description={
            <span>
              No Recommendations found. Please update your profile to start getting recommendations.
            </span>
          }
        ></Empty>
      ) : (
        <>
          <UserInfoCardsList matchesData={recommendations} />
          {/* <UserInfoCardsList matchesData={recommendations} cardSelfUserIdHandle={() => sendUserId(userId)} /> */}
        </>
      )}
    </div>
  );
}

export default Recommendations;
