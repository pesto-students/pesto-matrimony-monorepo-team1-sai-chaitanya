import { startCase } from 'lodash';
import { useEffect, useState } from 'react';
import { UserInfoCard, UserInfoCardsList } from '../../components';
import { useParams } from 'react-router-dom';
import styles from './matches.module.scss';
import { useOktaAuth } from '@okta/okta-react';
import axios from 'axios';

const Matches = () => {
  const { authState } = useOktaAuth();
  const { matchStatus } = useParams();
  const [interestsReceived, setInterestsReceived] = useState([]);
  const [interestsSent, setInterestsSent] = useState([]);
  const [profilesToDisplay, setProfilesToDisplay] = useState([]);
  const [acceptedProfilesOktaIds, setAcceptedProfilesOktaIds] = useState([]);
  const [sentProfilesOktaIds, setSentProfilesOktaIds] = useState([]);
  const [receivedProfilesOktaIds, setReceivedProfilesOktaIds] = useState([]);
  const oktaIdOfLoggedInUser = authState.accessToken.claims.uid;

  // Create a Backend Route for "/matches/:matchStatus" that sends
  // different data based on "matchStatus" parameter.
  console.log('currentPage= ', matchStatus);

  const fetchProfilesData = (oktaIdsArray) => {
    const profilesData = [];
    oktaIdsArray.forEach((oktaId) => {
      axios
        .get(`http://localhost:8000/api/v1/users/userprofile/${oktaId}`)
        .then((res) => profilesData.push(res.data.currentUser[0]))
        .catch((err) => console.log(err));
    });
    console.log(profilesData);
    return profilesData;
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/v1/users/userprofile/${oktaIdOfLoggedInUser}`)
      .then((res) => {
        const userData = res.data.currentUser[0];
        setInterestsReceived([...userData.interestsReceived]);
        setInterestsSent([...userData.interestsSent]);
        const allInterests = [...userData.interestsSent, ...userData.interestsReceived];
        const acceptedProfiles = [];
        const sentProfiles = [];
        const receivedProfiles = [];
        allInterests.forEach((interest) => {
          if (interest.isAccepted === true) {
            if (interest.interestSenderId !== oktaIdOfLoggedInUser) {
              // Profiles from whom I accepted interest
              acceptedProfiles.push(interest.interestSenderId);
            }
            if (interest.interestReceiverId !== oktaIdOfLoggedInUser) {
              // Profiles that accepted my interest
              acceptedProfiles.push(interest.interestReceiverId);
            }
          } else {
            // Profiles to which I sent interest and not yet accepted.
            if (interest.interestSenderId === oktaIdOfLoggedInUser) {
              sentProfiles.push(interest.interestReceiverId);
            }
            // profiles from which I received interest and not yet accepted.
            if (interest.interestReceiverId === oktaIdOfLoggedInUser) {
              receivedProfiles.push(interest.interestSenderId);
            }
          }
        });
        setAcceptedProfilesOktaIds(acceptedProfiles);
        setSentProfilesOktaIds(sentProfiles);
        setReceivedProfilesOktaIds(receivedProfiles);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    // Do a GET request for the backend route
    // Fetch appropriate data (shortlisted/accepted) based on the "matchStatus" url param.
    if (matchStatus === 'received') {
      const profilesData = fetchProfilesData(receivedProfilesOktaIds);
      setProfilesToDisplay(profilesData);
    } else if (matchStatus === 'sent') {
      const profilesData = fetchProfilesData(sentProfilesOktaIds);
      setProfilesToDisplay(profilesData);
    } else if (matchStatus === 'accepted') {
      const profilesData = fetchProfilesData(acceptedProfilesOktaIds);
      setProfilesToDisplay(profilesData);
    }
    // use setMatchesData and set state variable
    // Then Matches page will re-render with updated(appropriate) data...
  }, [matchStatus]);

  console.log(profilesToDisplay);
  return (
    <div className={styles.matchesPage}>
      <h2>Matches Page - Interests {startCase(matchStatus)}</h2>
      <UserInfoCardsList matchesData={profilesToDisplay} />
      {/* Below UserInfoCard is for Demo Purposes only... */}
      {/* <UserInfoCard /> */}
    </div>
  );
};

export default Matches;
