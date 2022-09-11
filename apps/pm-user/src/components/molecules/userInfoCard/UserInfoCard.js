import { useState, useRef } from 'react';
import { showNotification } from '@pm/pm-ui';
import { UserInfoCardButtons } from '../';
import { useOktaAuth } from '@okta/okta-react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import styles from './userInfoCard.module.scss';
import { Button, Carousel, ClearOutlined, Modal, SendOutlined, TextArea } from '../../atoms';
import axios from 'axios';

const UserInfoCard = ({
  idOfLoggedInUser,
  profileAboutMe,
  profileAge,
  profileId,
  profileLocation,
  profileImages,
  profileName,
  cardSelfUserIdHandle
}) => {
  const { authState } = useOktaAuth();
  //getting current user's oktaId
  const oktaIdOfLoggedInUser = authState.accessToken.claims.uid;

  const [isMessageModalVisible, setIsMessageModalVisible] = useState(false);
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
    axios
      .put(
        `https://pmapi-pesto.herokuapp.com/api/v1/interests/accept?sender=${profileId}&receiver=${oktaIdOfLoggedInUser}`
      )
      .then((res) => {
        if (res.data.success) {
          showNotification('success', 'Success!', `You've accepted interest from ${profileName}.`);
        } else {
          showNotification('warn', 'Error!', "Couldn't accept interest. Please try later.");
        }
      })
      .catch((error) => {
        showNotification('error', 'Error!', "Couldn't accept interest. Please try later.");
      });
  }
  function cancelInterestHandler() {
    axios
      .put(
        `https://pmapi-pesto.herokuapp.com/api/v1/interests/cancel?sender=${oktaIdOfLoggedInUser}&receiver=${profileId}`
      )
      .then((res) => {
        if (res.data.success) {
          showNotification('success', 'Success!', `You've cancelled interest sent to ${profileName}.`);
        } else {
          showNotification('warn', 'Error!', "Couldn't cancel interest. Please try later.");
        }
      })
      .catch((error) => {
        showNotification('error', 'Error!', "Couldn't cancel interest. Please try later.");
      });
  }
  function rejectInterestHandler() {
    axios
      .put(
        `https://pmapi-pesto.herokuapp.com/api/v1/interests/decline?sender=${profileId}&receiver=${oktaIdOfLoggedInUser}`
      )
      .then((res) => {
        if (res.data.success) {
          showNotification('success', 'Success!', `You've rejected interest from ${profileName}.`);
        } else {
          showNotification('warn', 'Error!', "Couldn't reject interest. Please try later.");
        }
      })
      .catch((error) => {
        showNotification('error', 'Error!', "Couldn't reject interest. Please try later.");
      });
  }
  function sendInterestHandler() {
    axios
      .post(`https://pmapi-pesto.herokuapp.com/api/v1/interests?sender=${oktaIdOfLoggedInUser}&receiver=${profileId}`)
      .then((res) => {
        if (res.data.success) {
          showNotification('success', 'Success!', `Your interest has been sent to ${profileName}`);
        } else {
          showNotification('warn', 'Reminder!', res.data.error);
        }
      })
      .catch((error) => {
        showNotification('error', 'Error!', "Couldn't send your interest. Please try later.");
      });
  }
  function sendMessageViaModalHandler() {
    const message = messageRef.current.resizableTextArea.props.value.trim();
    if (message.length > 0) {
      axios
        .post(
          `https://pmapi-pesto.herokuapp.com/api/v1/conversations?sender=${oktaIdOfLoggedInUser}&receiver=${profileId}`,
          {
            message,
          }
        )
        .then((res) => {
          showNotification('success', 'Success!', `Your message has been sent to ${profileName}`);
        })
        .catch((error) => {
          showNotification('error', 'Error!', "Couldn't send your message. Please try later.");
        });
      handleMessageCancel();
    } else {
      showNotification('warn', 'Error!', "Message can't be empty.");
    }
  }
  function toggleShortlistHandler() {
    axios
      .put(
        `https://pmapi-pesto.herokuapp.com/api/v1/toggleShortlist?shortlister=${oktaIdOfLoggedInUser}&shortlistee=${profileId}`
      )
      .then((res) => {
        if (res.data.success) {
          showNotification('success', 'Success!', res.data.message);
        } else {
          showNotification('warn', 'Error!', res.data.error);
        }
      })
      .catch((error) => {
        showNotification('warn', 'Error!', `Couldn't shortlist ${profileName}. Please try later.`);
      });
  }

  console.log(cardSelfUserIdHandle);

  const carouselImages = profileImages?.map((image, i) => {
    return (
      <div key={i}>
        <div className={styles.carousel}>
          <Link to={`/userprofile/undefined`} target="_blank">
            <img src={image} className={styles.img} />
          </Link>
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
          {oktaIdOfLoggedInUser !== profileId ? (
            <UserInfoCardButtons
              acceptInterestHandler={acceptInterestHandler}
              cancelInterestHandler={cancelInterestHandler}
              rejectInterestHandler={rejectInterestHandler}
              sendInterestHandler={sendInterestHandler}
              sendMessageHandler={sendMessageHandler}
              toggleShortlistHandler={toggleShortlistHandler}
            />
          ) : (
            ''
          )}
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
  idOfLoggedInUser: PropTypes.string,
  profileAboutMe: PropTypes.string,
  profileAge: PropTypes.string,
  profileId: PropTypes.string,
  profileImages: PropTypes.array,
  profileLocation: PropTypes.string,
  profileName: PropTypes.string,
};

UserInfoCard.defaultProps = {
  idOfLoggedInUser: '',
  profileAboutMe: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum reiciendis deserunt esse harum impedit non beatae sequi facilis officiis consequuntur possimus porro minima maxime inventore sed, error unde perferendis? Laboriosam?`,
  profileAge: '29',
  profileId: 'xyz',
  profileImages: [
    'https://picsum.photos/700/500?random=1',
    'https://picsum.photos/700/500?random=2',
    'https://picsum.photos/700/500?random=3',
    'https://picsum.photos/700/500?random=4',
    'https://picsum.photos/700/500?random=5',
  ],
  profileLocation: 'Location',
  profileName: 'User Name',
};

export default UserInfoCard;
