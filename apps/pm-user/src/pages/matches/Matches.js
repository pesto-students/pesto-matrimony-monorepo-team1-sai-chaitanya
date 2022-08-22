import { useEffect, useState } from 'react';
import { UserInfoCardsList } from '../../components';
import styles from './matches.module.scss';
import axios from 'axios';

const Matches = () => {
  const [matchesData, setMatchesData] = useState([]);
  // Create a Backend Route for "/matches/:matchStatus" that sends
  // different data based on "matchStatus" parameter.

  useEffect(() => {
    // Do a GET request for the backend route
    // Fetch appropriate data (shortlisted/accepted).
    // use setMatchesData and set state variable
    // Then Matches page will re-render with updated(appropriate) data...
  }, []);
  return (
    <div className={styles.matchesPage}>
      <h2>Matches Page</h2>
      <UserInfoCardsList matchesData={matchesData} />
    </div>
  );
};

export default Matches;
