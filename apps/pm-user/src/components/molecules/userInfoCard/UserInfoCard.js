import { useState, useRef } from 'react';
import { showNotification } from '@pm/pm-ui';
import PropTypes from 'prop-types';
import styles from './userInfoCard.module.scss';
import {
  Button,
  Carousel,
  ClearOutlined,
  HeartOutlined,
  Input,
  Modal,
  ProfileOutlined,
  SendOutlined,
} from '../../atoms';

const UserInfoCard = ({
  profileAboutMe,
  profileAge,
  profileId,
  profileLocation,
  profileImages,
  profileName,
}) => {
  const [isMessageModalVisible, setIsMessageModalVisible] = useState(false);
  const { TextArea } = Input;
  const messageRef = useRef();
  const showMessageModal = () => {
    setIsMessageModalVisible(true);
  };

  const handleMessageCancel = () => {
    setIsMessageModalVisible(false);
  };

  function sendMessageHandler() {
    showMessageModal();
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

  function sendMessageViaModalHandler() {
    const message = messageRef.current.resizableTextArea.props.value;
    console.log(message);
    // Connect with Backend and save this message.

    // Show any one notification below.
    if (message.trim().length > 0) {
      setTimeout(() => {
        handleMessageCancel();
        showNotification(
          'success',
          'Message Sent',
          `Congratulations! Your message has been sent to ${profileName}`,
          0
        );
      }, 1500);
    } else {
      showNotification('warn', 'Error!', "Message can't be empty.");
    }
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
          <a href={`/profile/${profileId}`} target="_blank">
            <img src={image} className={styles.img} />
          </a>
        </div>
      </div>
    );
  });

  return (
    <>
      <div className={styles.userInfoCard}>
        <Carousel effect="fade" autoplay autoplaySpeed={2000}>
          {carouselImages}
        </Carousel>
        <div className={styles.briefIntro}>
          <h2>{profileName}</h2>
          <h4>
            {profileAge}, {profileLocation}
          </h4>
          <p>{profileAboutMe}</p>
        </div>
        <div className={styles.buttons}>
          <Button
            type="primary"
            shape="round"
            icon={<HeartOutlined />}
            size="middle"
            onClick={sendInterestHandler}
          >
            Send Interest
          </Button>
          <Button
            type="primary"
            shape="round"
            icon={<ProfileOutlined />}
            size="middle"
            onClick={toggleShortlistHandler}
          >
            Shortlist
          </Button>
          <Button
            type="primary"
            shape="round"
            icon={<SendOutlined />}
            size="middle"
            onClick={sendMessageHandler}
          >
            Send Message
          </Button>
        </div>
      </div>
      <Modal
        title={`Sending Message to ${name}`}
        visible={isMessageModalVisible}
        onCancel={handleMessageCancel}
        destroyOnClose={true}
        footer={null}
      >
        <p>Type your message below : </p>
        <TextArea showCount maxLength={300} ref={messageRef} allowClear />
        <Button
          type="primary"
          shape="round"
          icon={<SendOutlined />}
          size="middle"
          onClick={sendMessageViaModalHandler}
        >
          Send Message
        </Button>
        <Button
          type="primary"
          shape="round"
          icon={<ClearOutlined />}
          size="middle"
          onClick={handleMessageCancel}
        >
          Cancel
        </Button>
      </Modal>
    </>
  );
};

UserInfoCard.propTypes = {
  profileAboutMe: PropTypes.string,
  profileAge: PropTypes.number,
  profileId: PropTypes.string,
  profileImages: PropTypes.array,
  profileLocation: PropTypes.string,
  profileName: PropTypes.string,
};

UserInfoCard.defaultProps = {
  profileAboutMe: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum reiciendis deserunt esse harum impedit non beatae sequi facilis officiis consequuntur possimus porro minima maxime inventore sed, error unde perferendis? Laboriosam?`,
  profileAge: 32,
  profileId: 'abcd',
  profileImages: [
    'https://picsum.photos/800/800',
    'https://picsum.photos/800/801',
    'https://picsum.photos/800/900',
    'https://picsum.photos/900/800',
    'https://picsum.photos/900/802',
  ],
  profileLocation: 'Bhopal',
  profileName: 'Vinit Sharma',
};

export default UserInfoCard;
