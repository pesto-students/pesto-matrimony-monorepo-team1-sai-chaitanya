import { startCase } from 'lodash';
import { useEffect, useState } from 'react';
import { UserInfoCard, UserInfoCardsList } from '../../components';
import { useParams } from 'react-router-dom';
import styles from './matches.module.scss';
import axios from 'axios';

const Matches = () => {
  const { matchStatus } = useParams();
  const [matchesData, setMatchesData] = useState([]);
  // Create a Backend Route for "/matches/:matchStatus" that sends
  // different data based on "matchStatus" parameter.
  console.log('currentPage= ', matchStatus);

  useEffect(() => {
    // Do a GET request for the backend route
    // Fetch appropriate data (shortlisted/accepted) based on the "matchStatus" url param.
    // use setMatchesData and set state variable
    // Then Matches page will re-render with updated(appropriate) data...
  }, []);
  return (
    <div className={styles.matchesPage}>
      <h2>Matches Page - Interests {startCase(matchStatus)}</h2>
      <UserInfoCardsList matchesData={matchesData} />
      {/* Below UserInfoCard is for Demo Purposes only... */}
      <UserInfoCard />
    </div>
  );
};

export default Matches;
