import PropTypes from 'prop-types';
import { MessagesBox } from '../../components';
import styles from './mailBox.module.scss';

const DUMMY_INTERESTS_ARRAY = [
  {
    interestSenderAge: 23,
    interestSenderId: 'vishal',
    interestSenderImage: 'http://placehold.jp/12/5c5fee/ffffff/40x40.png',
    interestSenderName: 'Vishal',
    interestReceiverAge: 22,
    interestReceiverId: 'shivani',
    interestReceiverImage: 'http://placehold.jp/12/573527/ffffff/40x40.png',
    interestReceiverName: 'Shivani',
    isAccepted: false,
    isRejected: false,
    conversations: [
      { messageSenderId: 'vishal', messageReceiverId: 'shivani', message: 'Hello, Shivani.' },
      { messageSenderId: 'shivani', messageReceiverId: 'vishal', message: 'Hello, Vishal.' },
      { messageSenderId: 'vishal', messageReceiverId: 'shivani', message: 'Dummy message from Vishal.' },
      { messageSenderId: 'vishal', messageReceiverId: 'shivani', message: 'Dummy message from Vishal.' },
      { messageSenderId: 'shivani', messageReceiverId: 'vishal', message: 'Dummy message from Shivani.' },
      { messageSenderId: 'shivani', messageReceiverId: 'vishal', message: 'Dummy message from Shivani.' },
    ],
  },
];

const MailBox = ({ idOfLoggedInUser, interestsSentAndReceived }) => {
  const renderMailBox = DUMMY_INTERESTS_ARRAY?.map((interest, i) => {
    if (interest.conversations.length > 0) {
      return (<div key={i}>
        <MessagesBox
          idOfLoggedInUser={idOfLoggedInUser}
          interestSenderName={interest.interestSenderName}
          interestSenderId={interest.interestSenderId}
          interestSenderAge={interest.interestSenderAge}
          interestSenderImage={interest.interestSenderImage}
          interestReceiverId={interest.interestReceiverId}
          interestReceiverName={interest.interestReceiverName}
          interestReceiverAge={interest.interestReceiverAge}
          interestReceiverImage={interest.interestReceiverImage}
          isAccepted={interest.isAccepted}
          isRejected={interest.isRejected}
          conversations={interest.conversations}
        />
      </div>
      );
    }
  });

  return (
    <div className={styles.mailBox}>
      <div className={styles.header}>
        <h2>MailBox</h2>
      </div>
      <div className={styles.content}>
        {renderMailBox}
      </div>
    </div>
  );
};

MailBox.propTypes = {
  idOfLoggedInUser: PropTypes.string,
  interestsSentAndReceived: PropTypes.array,
};

MailBox.defaultProps = {
  idOfLoggedInUser: 'shivani',
  interestsSentAndReceived: [],
};

export default MailBox;