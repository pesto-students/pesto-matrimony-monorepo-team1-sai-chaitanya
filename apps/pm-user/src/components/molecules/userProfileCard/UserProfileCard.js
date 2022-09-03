import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../atoms';
import { Link } from "react-router-dom";
import styles from './userProfileCard.module.scss';

const UserProfileCard = ({ children, title }) => {
  return (
    <div className={styles.userProfileCard}>
      <div className={styles.cardTitleWrpper}>
        <span>{title} </span>
        <Link to="/edit-profile">
        <Button shape="round" size="middle" type="primary">
          Edit
        </Button>
        </Link>
      </div>
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
