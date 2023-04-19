import React from 'react';
import { EditProfile } from '../../components';
import styles from './editProfilePage.module.scss';
const EditProfilePage = () => {
  return (
    <div className={styles.editProfilePage}>
    <div className={styles.headingWraper}>
    <h1 className={styles.editProfilePageHeading}>Edit Personal Details Page</h1>
    </div>
      <EditProfile />
    </div>
  );
};

export default EditProfilePage;
