import { startCase } from 'lodash';
import { useEffect, useState } from 'react';
import { UserInfoCard, UserInfoCardsList } from '../../components';
import { useParams } from 'react-router-dom';
import styles from './matches.module.scss';
import { useOktaAuth } from '@okta/okta-react';
import _ from 'lodash';
import { Button, Empty, Spin } from 'antd';
import axios from 'axios';

const Matches = () => {
  const { authState } = useOktaAuth();
  const { matchStatus } = useParams();
  const [profilesToDisplay, setProfilesToDisplay] = useState([]);
  const [responseToCheck, setResponseToCheck] = useState({});
  // const [emptyMessage, setemptyMessage] = useState("");
  const [acceptedProfilesOktaIds, setAcceptedProfilesOktaIds] = useState([]);
  const [sentProfilesOktaIds, setSentProfilesOktaIds] = useState([]);
  const [receivedProfilesOktaIds, setReceivedProfilesOktaIds] = useState([]);
  const oktaIdOfLoggedInUser = authState.accessToken.claims.uid;

  // Create a Backend Route for "/matches/:matchStatus" that sends
  // different data based on "matchStatus" parameter.

  useEffect(() => {
    async function getAllTypesOfProfiles() {
      const res = await axios.get(`https://pmapi-pesto.herokuapp.com/api/v1/users/userprofile/${oktaIdOfLoggedInUser}`);
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
    try {
      getAllTypesOfProfiles();
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    if (matchStatus === 'received') {
      async function fetchReceivedProfilesData() {
        const profilesData = await Promise.all(
          receivedProfilesOktaIds.map(async (id) => {
            const response = await axios.get(`https://pmapi-pesto.herokuapp.com/api/v1/users/userprofile/${id}`);
            setResponseToCheck(response);

            return response.data.currentUser[0];
          })
        );

        setProfilesToDisplay(profilesData);
      }
      // calling the function
      try {
        fetchReceivedProfilesData();
      } catch (err) {
        console.log(err);
      }
    }
    if (matchStatus === 'sent') {
      async function fetchSentProfilesData() {
        const profilesData = await Promise.all(
          sentProfilesOktaIds.map(async (id) => {
            const response = await axios.get(`https://pmapi-pesto.herokuapp.com/api/v1/users/userprofile/${id}`);
            setResponseToCheck(response);
            return response.data.currentUser[0];
          })
        );
        try {
          setProfilesToDisplay(profilesData);
        } catch (err) {
          console.log(err);
        }
      }
      // calling the function
      fetchSentProfilesData();
    }
    if (matchStatus === 'accepted') {
      async function fetchAcceptedProfilesData() {
        const profilesData = await Promise.all(
          acceptedProfilesOktaIds.map(async (id) => {
            const response = await axios.get(`https://pmapi-pesto.herokuapp.com/api/v1/users/userprofile/${id}`);
            setResponseToCheck(response);
            return response.data.currentUser[0];
          })
        );
        try {
          setProfilesToDisplay(profilesData);
        } catch (err) {
          console.log(err);
        }
      }
      // calling the function
      try {
        fetchAcceptedProfilesData();
      } catch (err) {
        console.log(err);
      }
    }
  }, [matchStatus, acceptedProfilesOktaIds, sentProfilesOktaIds, receivedProfilesOktaIds]);

  if (_.isEmpty(responseToCheck)) {
    return (
      <div>
        <h2 className={styles.pageHeading}>Matches Page - Interests {startCase(matchStatus)}</h2>
        <Spin className={styles.pageLoaderSpin} />
      </div>
    );
  }

  var emptyMessage = '';

  if (matchStatus === 'received') {
    emptyMessage = 'You have not recieved any interest yet';
  } else if (matchStatus === 'sent') {
    emptyMessage = 'You did not send any interest yet';
  } else if (matchStatus === 'accepted') {
    emptyMessage = 'You have not accepted any interest yet';
  }

  return (
    <div className={styles.matchesPage}>
      <h2 className={styles.pageHeading}>
        Matches Page - Interests <span className={styles.changableText}>{startCase(matchStatus)}</span>
      </h2>
      {profilesToDisplay.length < 1 ? (
        <>
          <Empty
            description={
              <span>
                <p>{emptyMessage}</p>
              </span>
            }
          />
        </>
      ) : (
        <UserInfoCardsList matchesData={profilesToDisplay} />
      )}
    </div>
  );
};

export default Matches;
