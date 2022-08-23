import React from 'react';
import styles from './oldMessages.module.scss';
import PropTypes from 'prop-types';

const OldMessages = ({ conversations, idOfLoggedInUser, interestSenderImage, interestReceiverImage }) => {
  console.log(idOfLoggedInUser, interestSenderImage, interestReceiverImage)
  return (
    <div className={styles.oldMessages}>
      {conversations.map(
        ({
          message,
          messageSenderId,
        }) => {
          const thisClassName = idOfLoggedInUser === messageSenderId ? "sender" : "receiver";
          return (
            <div className={styles[thisClassName]}>
              <div className={styles.image}>
                <img
                  src={messageSenderId === idOfLoggedInUser ? interestReceiverImage : interestSenderImage}
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
