import { Image } from 'antd';
import PropTypes from 'prop-types';
import styles from './profileSummary.module.scss';
import { Link } from 'react-router-dom';

const userName = {
  fontSize: '22px',
};

const ProfileSummary = ({ imageChangeLink, userDetails, userImageSrc, userName }) => {
  return (
    <div className={styles.profileSummary}>
      <div className={styles.userName}>{userName}</div>
      <div className={styles.userDetails}>{userDetails}</div>
    </div>
  );
};

ProfileSummary.propTypes = {
  userName: PropTypes.string,
  userDetails: PropTypes.string,
};

ProfileSummary.defaultProps = {
  userName: 'Your Name',
  userDetails: 'Your details',
};

export default ProfileSummary;
