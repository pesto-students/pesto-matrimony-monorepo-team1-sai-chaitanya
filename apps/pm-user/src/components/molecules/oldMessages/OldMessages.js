import { noop as _noop } from 'lodash';
import PropTypes from 'prop-types';
import styles from './oldMessages.module.scss';

const OldMessages = ({ conversations, idOfLoggedInUser, interestReceiverImage, interestSenderImage }) => {
  const renderOldMessages = conversations.map(({ message, messageSenderId }) => {
    const thisClassName = idOfLoggedInUser === messageSenderId ? 'sender' : 'receiver';
    return (
      <div className={styles[thisClassName]}>
        <div className={styles.image}>
          <img src={messageSenderId === idOfLoggedInUser ? interestReceiverImage : interestSenderImage} />
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
  interestReceiverImage: PropTypes.string,
  interestSenderImage: PropTypes.string,
};

OldMessages.defaultProps = {
  conversations: [],
  idOfLoggedInUser: 'idOfLoggedInUser',
  interestReceiverImage: 'http://placehold.jp/12/573527/ffffff/40x40.png',
  interestSenderImage: 'http://placehold.jp/12/5c5fee/ffffff/40x40.png',
};

export default OldMessages;
