import { useState, useRef } from 'react';
import { showNotification } from '@pm/pm-ui';
import { UserInfoCardButtons } from '../';
import PropTypes from 'prop-types';
import styles from './userInfoCard.module.scss';
import { Button, Carousel, ClearOutlined, Input, Modal, SendOutlined } from '../../atoms';

const UserInfoCard = ({ profileAboutMe, profileAge, profileId, profileLocation, profileImages, profileName }) => {
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
  function acceptInterestHandler() {
    // Do DB operation. update isAccepted to true for interest object inside both receiver and sender

    // Then send notification about success / failure
    showNotification(
      'success',
      'Interest Accepted!',
      'Congratulations. You are one step closer to finding your soul-mate.'
    );
    showNotification('error', 'Error!', 'Error accepting the interest. Please try later.');
  }
  function cancelInterestHandler() {
    // connect to backend and delete the interest object in interestsReceived array of receiver
    // also, delete interest object in interestsSent array of Sender

    // if success
    showNotification('success', 'Success!', `You've cancelled interest sent to ${profileName}.`);

    // if fails
    showNotification('warn', 'Error!', "Couldn't cancel your interest. Please try later.");
  }
  function rejectInterestHandler() {
    // Do DB operation. update isRejected to true for interest object inside of sender only.
    // Then delete the interest object in receiver

    // Then send notification about success / failure
    showNotification('info', 'Interest Declined!', 'You will no longer receive messages from the sender.');
    showNotification('error', 'Error!', 'Error declining the interest. Please try later.');
  }
  function sendInterestHandler() {
    // connect to backend and add the interest object in interestsReceived array of receiver
    // also, add the same interest object in interestsSent array of Sender

    // show ANY ONE notification after backend operation succeeds.
    // If interest was previously sent... notify that it was sent already.
    // If interest was NOT sent before... notify that
    // if success
    showNotification(
      'success',
      'Success!',
      `Interest sent. You can send & receive messages after ${profileName} accepts your interest.`
    );

    // if fails
    showNotification('warn', 'Error!', "Couldn't send your interest. Please try later.");
  }
  function sendMessageViaModalHandler() {
    const message = messageRef.current.resizableTextArea.props.value;
    console.log(message);
    // Connect with Backend and save this message.

    // Show any one notification below.
    if (message.trim().length > 0) {
      setTimeout(() => {
        handleMessageCancel();
        showNotification('success', 'Message Sent', `Congratulations! Your message has been sent to ${profileName}`, 0);
      }, 1500);
    } else {
      showNotification('warn', 'Error!', "Message can't be empty.");
    }
  }
  function toggleShortlistHandler() {
    console.log("Connect to Backend & save _id of this profile to logged-in user's shortlist array");

    // show ANY ONE notification after backend operation succeeds.

    // if success
    showNotification('success', 'Success!', `${profileName} has been shortlisted.`);

    // if fails
    showNotification('warn', 'Error!', "Couldn't shortlist profile. Please try later.");

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
        <Carousel effect="fade" autoplay autoplaySpeed={5000}>
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
          <UserInfoCardButtons
            acceptInterestHandler={acceptInterestHandler}
            cancelInterestHandler={cancelInterestHandler}
            rejectInterestHandler={rejectInterestHandler}
            sendInterestHandler={sendInterestHandler}
            sendMessageHandler={sendMessageHandler}
            toggleShortlistHandler={toggleShortlistHandler}
          />
        </div>
      </div>
      <Modal
        title={`Sending Message to ${profileName}`}
        visible={isMessageModalVisible}
        onCancel={handleMessageCancel}
        destroyOnClose={true}
        footer={null}
      >
        <p>Type your message below : </p>
        <TextArea showCount maxLength={300} ref={messageRef} allowClear />
        <Button type="primary" shape="round" icon={<SendOutlined />} size="middle" onClick={sendMessageViaModalHandler}>
          Send Message
        </Button>
        <Button type="primary" shape="round" icon={<ClearOutlined />} size="middle" onClick={handleMessageCancel}>
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
  profileAge: 29,
  profileId: 'abcd',
  profileImages: [
    'https://picsum.photos/700/500?random=1',
    'https://picsum.photos/700/500?random=2',
    'https://picsum.photos/700/500?random=3',
    'https://picsum.photos/700/500?random=4',
    'https://picsum.photos/700/500?random=5',
  ],
  profileLocation: 'Bhopal',
  profileName: 'Payal Singh',
};

export default UserInfoCard;
