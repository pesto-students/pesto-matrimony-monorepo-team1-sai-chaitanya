import {
  EditEducationAndCareerDetails,
  EditFamilyDetails,
  EditPartnerPreferences,
  EditPersonalDetails,
  EditReligionDetails,
  ImageUploadSection,
} from '../../molecules';
import styles from './editProfile.module.scss';

const EditProfile = ({}) => {
  return (
    <div className={styles.editProfile}>
      <div className={styles.imagesSection}>
        <h2>Upload Photos</h2>
        <ImageUploadSection />
      </div>
      <div className={styles.personalDetails}>
        <h2>Update Personal Information</h2>
        <EditPersonalDetails />
      </div>
      <div className={styles.educationDetails}>
        <h2>Update Education & Career Information</h2>
        <EditEducationAndCareerDetails />
      </div>
      <div className={styles.familyDetails}>
        <h2>Update Family Details</h2>
        <EditFamilyDetails />
      </div>
      <div className={styles.religionDetails}>
        <h2>Update Religious and Horoscope Details</h2>
        <EditReligionDetails />
      </div>
      <div className={styles.partnerPreferences}>
        <h2>Set Partner Preferences</h2>
        <EditPartnerPreferences />
      </div>
    </div>
  );
};

export default EditProfile;
