import { useState, useEffect } from 'react';
import { UserInfoCardsList } from '../../components';
import { useOktaAuth } from '@okta/okta-react';
import axios from 'axios';

const Shortlisted = () => {
  const { authState } = useOktaAuth();
  const [shortlistedMatchesData, setShortlistedMatchesData] = useState([]);

  //getting current user's oktaId
  const oktaUserId = authState.accessToken.claims.uid;

  let actualShortlistedMatcheshData = [];
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/v1/users/userprofile/${oktaUserId}`)
      .then((res) => {
        const idsOfShortlistedUsers = res.data.currentUser[0].shortlistedMatches;
        idsOfShortlistedUsers.forEach((id) => {
          axios
            .get(`http://localhost:8000/api/v1/users/userprofile/${id}`)
            .then((res) => {
              actualShortlistedMatcheshData.push(res.data.currentUser[0]);
            })
            .catch((err) => console.log(err));
        });
      })
      .then(() => {
        console.log('finally... ', actualShortlistedMatcheshData);
        setShortlistedMatchesData(actualShortlistedMatcheshData);
      })
      .catch((err) => console.log(err));
  }, []);

  console.log(shortlistedMatchesData);
  return (
    <div>
      <h2>Shortlisted Profiles</h2>
      <UserInfoCardsList matchesData={shortlistedMatchesData} />
    </div>
  );
};

export default Shortlisted;
