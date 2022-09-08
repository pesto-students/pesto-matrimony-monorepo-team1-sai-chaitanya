import { Image } from '../../atoms';
import PropTypes from 'prop-types';
import styles from './profileSummary.module.scss';
import { Link } from "react-router-dom";

const ProfileSummary = ({ imageChangeLink, userDetails, userImageSrc, userName }) => {
  return (
    <div className={styles.profileSummary}>
      <Image src={userImageSrc} />
      <Link to={imageChangeLink} className={styles.changeImage}>
      <div className={styles.changeImage}>
        Change Image
      </div>
      </Link>  
      <div className={styles.userName}>{userName}</div>
      <div className={styles.userDetails}>{userDetails}</div>
    </div>
  );
};

ProfileSummary.propTypes = {
  imageChangeLink: PropTypes.string,
  userImageSrc: PropTypes.string,
  userName: PropTypes.string,
  userDetails: PropTypes.string,
};

ProfileSummary.defaultProps = {
  imageChangeLink: '#',
  userImageSrc: '#',
  userName: 'Your Name',
  userDetails: 'Your Pesonal details',
};

export default ProfileSummary;
