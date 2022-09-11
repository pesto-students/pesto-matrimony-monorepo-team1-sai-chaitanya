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
  const [profilesToDisplay, setProfilesToDisplay] = useState([]);
  const [acceptedProfilesOktaIds, setAcceptedProfilesOktaIds] = useState([]);
  const [sentProfilesOktaIds, setSentProfilesOktaIds] = useState([]);
  const [receivedProfilesOktaIds, setReceivedProfilesOktaIds] = useState([]);
  const oktaIdOfLoggedInUser = authState.accessToken.claims.uid;

  // Create a Backend Route for "/matches/:matchStatus" that sends
  // different data based on "matchStatus" parameter.

  useEffect(() => {
    async function getAllTypesOfProfiles() {
      const res = await axios.get(`http://localhost:8000/api/v1/users/userprofile/${oktaIdOfLoggedInUser}`);
      const userData = res.data.currentUser[0];
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
    }
    getAllTypesOfProfiles();

    if (matchStatus === 'received') {
      async function fetchReceivedProfilesData() {
        const profilesData = await Promise.all(
          receivedProfilesOktaIds.map(async (id) => {
            const response = await axios.get(`http://localhost:8000/api/v1/users/userprofile/${id}`);
            return response.data.currentUser[0];
          })
        );
        setProfilesToDisplay(profilesData);
      }
      // calling the function
      fetchReceivedProfilesData();
    } else if (matchStatus === 'sent') {
      async function fetchSentProfilesData() {
        const profilesData = await Promise.all(
          sentProfilesOktaIds.map(async (id) => {
            const response = await axios.get(`http://localhost:8000/api/v1/users/userprofile/${id}`);
            return response.data.currentUser[0];
          })
        );
        setProfilesToDisplay(profilesData);
      }
      // calling the function
      fetchSentProfilesData();
    } else if (matchStatus === 'accepted') {
      async function fetchAcceptedProfilesData() {
        const profilesData = await Promise.all(
          acceptedProfilesOktaIds.map(async (id) => {
            const response = await axios.get(`http://localhost:8000/api/v1/users/userprofile/${id}`);
            return response.data.currentUser[0];
          })
        );
        setProfilesToDisplay(profilesData);
      }
      // calling the function
      fetchAcceptedProfilesData();
    }
  }, [matchStatus]);

  return (
    <div className={styles.matchesPage}>
      <h2>Matches Page - Interests {startCase(matchStatus)}</h2>
      {profilesToDisplay.length < 1 ? (
        <p>No Profiles to display.</p>
      ) : (
        <UserInfoCardsList matchesData={profilesToDisplay} />
      )}
    </div>
  );
};

export default Matches;
