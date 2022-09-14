import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../atoms';
import { Link } from "react-router-dom";
import _ from "lodash"
import styles from './userProfileCard.module.scss';

const UserProfileCard = ({ children, title }) => {
  return (
    <div className={styles.userProfileCard}>
      <div className={styles.cardTitleWrpper}>
        <span>{title} </span>
        <Link to="/edit-profile">
        <Button className={styles.profileCardButton} size="middle" type="primary">
          Edit
        </Button>
        </Link>
      </div>
      <div className={styles.cardChildren}>{children}</div>
    </div>
  );
};

UserProfileCard.propTypes = {
  children: PropTypes.func,
  title: PropTypes.string,
};

UserProfileCard.defaultProps = {
  children: _.noop(),
  title: 'Card Title',
};

export default UserProfileCard;
