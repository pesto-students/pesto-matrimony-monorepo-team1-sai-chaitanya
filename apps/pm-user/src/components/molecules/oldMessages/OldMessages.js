import axios from 'axios';
import { noop as _noop } from 'lodash';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import styles from './oldMessages.module.scss';

const baseUrl = 'https://pm-api-yr8y.onrender.com';
const oldBaseUrl = 'https://pmapi-pesto.herokuapp.com'; 

const OldMessages = ({
  conversations,
  idOfLoggedInUser,
  interestReceiverId,
  interestSenderId,
  interestSenderImage,
  interestReceiverImage,
}) => {
  const [imageOfSender, setImageOfSender] = useState('');
  const [imageOfReceiver, setImageofReceiver] = useState('');
  useEffect(() => {
    async function fetchImages() {
      const response1 = await axios.get(
        `${baseUrl}/api/v1/users/userprofile/${interestSenderId}`
      );

      const response2 = await axios.get(
        `${baseUrl}/api/v1/users/userprofile/${interestReceiverId}`
      );

      setImageOfSender(response1.data.currentUser[0].images[0]);
      setImageofReceiver(response2.data.currentUser[0].images[0]);
    }
    try {
      fetchImages();
    } catch (err) {
      console.log('failed to fetch images');
    }
  }, []);
  const renderOldMessages = conversations.map(({ message, messageSenderId }) => {
    const thisClassName = idOfLoggedInUser === messageSenderId ? 'sender' : 'receiver';
    if (imageOfReceiver === '') {
      setImageofReceiver(interestReceiverImage);
    }
    if (imageOfSender === '') {
      setImageOfSender(interestSenderImage);
    }
    return (
      <div className={styles[thisClassName]} key={Math.random()}>
        <div className={styles.image}>
          <img src={messageSenderId === idOfLoggedInUser ? imageOfSender : imageOfReceiver} />
        </div>
        <div className={styles.messageText}>{message}</div>
      </div>
    );
  });
  return <div className={styles.oldMessages}>{renderOldMessages}</div>;
};

OldMessages.propTypes = {
  conversations: PropTypes.array,
  idOfLoggedInUser: PropTypes.string,
  interestReceiverId: PropTypes.string,
  interestSenderId: PropTypes.string,
};

OldMessages.defaultProps = {
  conversations: [],
  idOfLoggedInUser: 'idOfLoggedInUser',
  interestReceiverId: 'http://placehold.jp/12/573527/ffffff/40x40.png',
  interestSenderId: 'http://placehold.jp/12/5c5fee/ffffff/40x40.png',
};

export default OldMessages;
