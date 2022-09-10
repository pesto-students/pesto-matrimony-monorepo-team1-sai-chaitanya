import { useState, useEffect } from 'react';
import { UserInfoCardsList } from '../../components';
import { useOktaAuth } from '@okta/okta-react';
import axios from 'axios';

const Shortlisted = () => {
  const { authState } = useOktaAuth();
  const [shortlistedProfileIds, setShortlistedProfileIds] = useState([]);
  const [shortlistedMatchesData, setShortlistedMatchesData] = useState([]);

  //getting current user's oktaId
  const oktaUserId = authState.accessToken.claims.uid;

  let actualShortlistedMatcheshData = [];
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/v1/users/userprofile/${oktaUserId}`)
      .then((res) => {
        const idsOfShortlistedUsers = res.data.currentUser[0].shortlistedMatches;
        console.log(idsOfShortlistedUsers);
        idsOfShortlistedUsers.forEach((id) => {
          axios
            .get(`http://localhost:8000/api/v1/users/userprofile/${id}`)
            .then((res) => {
              const data = res.data.currentUser[0];
              actualShortlistedMatcheshData.push(data);
            })
            .catch((err) => console.log(err));
            
        });
        console.log(actualShortlistedMatcheshData);
        setShortlistedMatchesData(actualShortlistedMatcheshData);
      })
      .catch((err) => console.log(err));
  }, []);

  //   if (shortlistedProfileIds.length > 0) {
  //     shortlistedProfileIds.forEach((id) => {
  //       axios
  //         .get(`http://localhost:8000/api/v1/users/userprofile/${id}`)
  //         .then((res) => {
  //           actualShortlistedMatcheshData.concat(res.data.currentUser[0]);
  //         })
  //         .catch((err) => console.log(err));
  //     });
  //   }

  console.log(shortlistedMatchesData);
  return (
    <>
      {shortlistedMatchesData.length < 1 ? (
        <p>You have not shortlisted any one. You can search and shortlist matches.</p>
      ) : (
        <UserInfoCardsList matchesData={shortlistedMatchesData} />
      )}
      ;
    </>
  );
};

export default Shortlisted;
