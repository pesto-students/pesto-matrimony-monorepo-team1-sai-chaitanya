import React from 'react';
import PropTypes from 'prop-types';
import styles from './userProfileCard.module.scss';

const UserProfileCard = ({ children, title }) => {
  return (
    <div className={styles.userProfileCard}>
      <div className={styles.cardTitle}>{title}</div>
      <div className={styles.cardChildren}>{children}</div>
    </div>
  );
};

UserProfileCard.propTypes = {
  children: PropTypes.obj,
  title: PropTypes.string,
};

UserProfileCard.defaultProps = {
  children: {},
  title: 'Card Title',
};

export default UserProfileCard;
