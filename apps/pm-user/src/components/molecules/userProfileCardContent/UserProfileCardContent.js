import React from 'react';
import PropTypes from 'prop-types';
import styles from './userProfileCardContent.module.scss';

const UserProfileCardContent = ({ description, field, value }) => {
  if (description) {
    return <div className={styles.description}>{description}</div>;
  }
  return (
    <>
      <div className={styles.fieldAndValues}>
        <div className={styles.field}>{field}</div>
        <div className={styles.value}>{value}</div>
      </div>
    </>
  );
};

UserProfileCardContent.propTypes = {
  description: PropTypes.string,
  field: PropTypes.string,
  value: PropTypes.string,
};

UserProfileCardContent.defaultProps = {
  description: '',
  field: '',
  value: '',
};

export default UserProfileCardContent;
