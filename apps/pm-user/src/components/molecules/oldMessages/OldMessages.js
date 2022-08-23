import React from 'react';
import styles from './oldMessages.module.scss';
import PropTypes from 'prop-types';

const OldMessages = ({ conversations, idOfLoggedInUser }) => {
  return (
    <div className={styles.oldMessages}>
      {conversations.map(
        ({
          message,
          interestSenderId,
          interestSenderImage,
          interestReceiverImage,
          interestReceiverName,
          interestSenderName,
        }) => {
          return (
            <div className={idOfLoggedInUser === interestSenderId ? `${styles.sender}` : `${styles.receiver}`}>
              <div className={styles.image}>
                <img
                  src={interestSenderId === idOfLoggedInUser ? interestSenderImage : interestReceiverImage}
                  alt={interestSenderId === idOfLoggedInUser ? interestSenderName : interestReceiverName}
                />
              </div>
              <div className={styles.messageText}>{message}</div>
            </div>
          );
        }
      )}
    </div >
  );
};

OldMessages.propTypes = {
  conversations: PropTypes.array,
  idOfLoggedInUser: PropTypes.string,
};

OldMessages.defaultProps = {
  conversations: [],
  idOfLoggedInUser: "idOfLoggedInUser"
};

export default OldMessages;
