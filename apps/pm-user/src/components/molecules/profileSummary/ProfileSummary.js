import React from 'react';
import { Image } from '../../atoms';
import PropTypes from 'prop-types';
import styles from './profilesummary.module.scss';

const ProfileSummary = ({
  imageChangeLink,
  userDetails,
  userImageSrc,
  userName,
}) => {
  return (
    <div className={styles.profileSummary}>
      <Image width={176} src={userImageSrc} />
      <div className={styles.changeImage}>
        <a href={imageChangeLink}>Change Image</a>
      </div>
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
