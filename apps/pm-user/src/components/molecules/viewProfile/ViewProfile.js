import { EditProfile } from '../../molecules';
import styles from './viewProfile.module.scss';
const ViewProfile = () => {
  return (
    <div className={styles.viewProfile}>
      {/* Rendereing EditProfile here for experimental purposes only. */}
      <EditProfile />
    </div>
  );
};

export default ViewProfile;
