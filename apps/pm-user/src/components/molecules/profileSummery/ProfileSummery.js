import React from 'react';
import { Image } from '../../atoms';
import PropTypes from 'prop-types';
import styles from './profilesummery.module.scss';

const ProfileSummery = ({
  imageChangeLink,
  userDetails,
  userImageSrc,
  userName,
}) => {
  return (
    <div className={styles.profileSummery}>
      <Image width={176} src={userImageSrc} />
      <div className={styles.changeImage}>
        <a href={imageChangeLink}>Change Image</a>
      </div>
      <div className={styles.userName}>{userName}</div>
      <div className={styles.userDetails}>{userDetails}</div>
    </div>
  );
};

ProfileSummery.propTypes = {
  imageChangeLink: PropTypes.string,
  userImageSrc: PropTypes.string,
  userName: PropTypes.string,
  userDetails: PropTypes.string,
};

ProfileSummery.defaultProps = {
  imageChangeLink: '#',
  userImageSrc: '#',
  userName: 'Your Name',
  userDetails: 'Your Pesonal details',
};

export default ProfileSummery;
