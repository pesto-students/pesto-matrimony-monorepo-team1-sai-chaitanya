import { useState } from 'react';
import { showNotification } from '@pm/pm-ui';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import styles from './bigRecommendationCard.module.scss';
import {
  Button,
  Carousel,
  EyeOutlined,
  HeartOutlined,
  Modal,
  PhoneOutlined,
  ProfileOutlined,
} from '../../atoms/';

const BigRecommendationCard = ({
  isMySubscriptionActive,
  isProfileShortlisted,
  profileAboutMe,
  profileAge,
  profileId,
  profileLocation,
  profileEmail,
  profilePhoneNumber,
  profileImages,
  profileName,
}) => {
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);

  const showContactModal = () => {
    setIsContactModalVisible(true);
  };

  const handleContactOk = () => {
    setIsContactModalVisible(false);
  };

  const handleContactCancel = () => {
    setIsContactModalVisible(false);
  };

  const history = useHistory();
  function viewProfileHandler() {
    history.push(`/profile/${profileId}`);
  }
  function viewContactHandler() {
    if (!isMySubscriptionActive) {
      showNotification(
        'error',
        'You must be a paid subscriber!',
        'Your subscription is inactive. Please purchase a new plan to view contact details of profiles.'
      );
    } else {
      showContactModal();
    }
  }

  function sendInterestHandler() {
    console.log('Connect to Backend & send message with template text');

    // show ANY ONE notification after backend operation succeeds.

    // if success
    showNotification(
      'success',
      'Success!',
      `Interest sent. You can send & receive messages after ${profileName} accepts your interest.`
    );

    // if fails
    showNotification(
      'warn',
      'Error!',
      "Couldn't send your interest. Please try later."
    );
  }

  function toggleShortlistHandler() {
    console.log(
      "Connect to Backend & save _id of this profile to logged-in user's shortlist array"
    );

    // show ANY ONE notification after backend operation succeeds.

    // if success
    showNotification(
      'success',
      'Success!',
      `${profileName} has been shortlisted.`
    );

    // if fails
    showNotification(
      'warn',
      'Error!',
      "Couldn't shortlist profile. Please try later."
    );

    // pick any one of below notifications based on server response.
  }

  const carouselImages = profileImages?.map((image, i) => {
    return (
      <div key={i}>
        <div className={styles.carousel}>
          <img src={image} className={styles.img} />
        </div>
      </div>
    );
  });

  return (
    <div className={styles.bigRecommendationCard}>
      <Carousel effect="fade" autoplay autoplaySpeed={2000}>
        {carouselImages}
      </Carousel>
      <div className={styles.briefIntro}>
        <h2>{profileName}</h2>
        <h4>
          {profileAge}, {profileLocation}
        </h4>
        <p>{profileAboutMe}</p>
        <div className={styles.buttons}>
          <Button
            type="primary"
            shape="round"
            icon={<EyeOutlined />}
            size="middle"
            onClick={viewProfileHandler}
          >
            View Profile
          </Button>
          <Button
            type="primary"
            shape="round"
            icon={<PhoneOutlined />}
            size="middle"
            onClick={viewContactHandler}
          >
            View Contact
          </Button>
          <Button
            type="primary"
            shape="round"
            icon={<ProfileOutlined />}
            size="middle"
            onClick={toggleShortlistHandler}
          >
            {isProfileShortlisted ? 'Un Shortlist' : 'Shortlist'}
          </Button>
          <Button
            type="primary"
            shape="round"
            icon={<HeartOutlined />}
            size="middle"
            onClick={sendInterestHandler}
          >
            Send Interest
          </Button>
        </div>
      </div>
      <Modal
        title={`Contact Details of ${profileName}`}
        visible={isContactModalVisible}
        onOk={handleContactOk}
        onCancel={handleContactCancel}
      >
        <p>Fetch this data from server</p>
        <p>Phone Number : {profilePhoneNumber}</p>
        <p>Email Address : {profileEmail}</p>
      </Modal>
    </div>
  );
};

BigRecommendationCard.propTypes = {
  isMySubscriptionActive: PropTypes.bool,
  isProfileShortlisted: PropTypes.bool,
  myProfileId: PropTypes.string,
  profileAboutMe: PropTypes.string,
  profileAge: PropTypes.number,
  profileLocation: PropTypes.string,
  profileId: PropTypes.string,
  profileImages: PropTypes.array,
  profileName: PropTypes.string,
};

BigRecommendationCard.defaultProps = {
  isMySubscriptionActive: true,
  isProfileShortlisted: false,
  myProfileId: 'xyzz',
  profileAboutMe: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum reiciendis deserunt esse harum impedit non beatae sequi facilis officiis consequuntur possimus porro minima maxime inventore sed, error unde perferendis? Laboriosam?`,
  profileAge: 32,
  profileLocation: 'Bhopal',
  profileId: 'abcd',
  profileImages: [
    'https://picsum.photos/800/800',
    'https://picsum.photos/800/801',
    'https://picsum.photos/800/900',
    'https://picsum.photos/900/800',
    'https://picsum.photos/900/802',
  ],
  profileName: 'Vinit Sharma',
};

export default BigRecommendationCard;
