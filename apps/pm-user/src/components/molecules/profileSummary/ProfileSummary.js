import { Image, PlusCircleOutlined } from '../../atoms';
import PropTypes from 'prop-types';
import styles from './profileSummary.module.scss';
import { Link } from "react-router-dom";
import { Spin, Skeleton } from 'antd';

const ProfileSummary = ({ imageChangeLink, userDetails, userImageSrc, userName }) => {
  return (
    <div className={styles.profileSummary}>
      <Image src={userImageSrc} />
      <Link to={imageChangeLink} className={styles.changeImage}>
      <div className={styles.changeImage}>
      <PlusCircleOutlined style={{ fontSize: "26px" }} />
      </div>
      </Link>  
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
  userImageSrc: "",
  userName: "Your Name",
  userDetails: "Your Details",
};

export default ProfileSummary;
