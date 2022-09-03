import React from 'react';
import { EditProfile } from '../../components';
import styles from './editProfilePage.module.scss';
const EditProfilePage = () => {
  return (
    <div className={styles.editProfilePage}>
      <h2>Edit Personal Details</h2>
      <EditProfile />
    </div>
  );
};

export default EditProfilePage;
