import { useEffect, useState } from 'react';
import { Segmented, Tooltip } from '../../atoms';
// import { SEGMENT_OPTIONS } from './constants';
import styles from './quickInfoBar.module.scss';
import axios from 'axios';
import { useOktaAuth } from '@okta/okta-react';

const QuickInfoBar = ({ onClick }) => {
  const { authState } = useOktaAuth();
  const oktaIdOfLoggedInUser = authState.accessToken.claims.uid;

  const [acceptedProfilesNumber, setAcceptedProfilesNumber] = useState(0);
  const [sentProfilesNumber, setSentProfilesNumber] = useState(0);
  const [receivedProfilesNumber, setReceivedProfilesNumber] = useState(0);
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
      setAcceptedProfilesNumber(acceptedProfiles.length);
      setSentProfilesNumber(sentProfiles.length);
      setReceivedProfilesNumber(receivedProfiles.length);
    }
    getAllTypesOfProfiles();
  }, []);
  const SEGMENT_OPTIONS = [
    {
      label: (
        <Tooltip title="Interests Received" color="#5c5fee">
          <div>
            <p>{receivedProfilesNumber}</p>
            <div style={{ fontSize: 12, color: '#a9aab9' }}>Received</div>
          </div>
        </Tooltip>
      ),
      key: 'received',
      value: 'received',
    },
    {
      label: (
        <Tooltip title="Interests Sent" color="#5c5fee">
          <div>
            <p>{sentProfilesNumber}</p>
            <div style={{ fontSize: 12, color: '#a9aab9' }}>Sent</div>
          </div>
        </Tooltip>
      ),
      key: 'sent',
      value: 'sent',
    },
    {
      label: (
        <Tooltip title="Interests accepted" color="#5c5fee">
          <div>
            <p>{acceptedProfilesNumber}</p>
            <div style={{ fontSize: 12, color: '#a9aab9' }}>Accepted</div>
          </div>
        </Tooltip>
      ),
      key: 'accepted',
      value: 'accepted',
    },
  ];
  return (
    <div className={styles.quickInfoBar}>
      <Segmented block defaultValue="received" onChange={onClick} options={SEGMENT_OPTIONS} />
    </div>
  );
};

export default QuickInfoBar;
