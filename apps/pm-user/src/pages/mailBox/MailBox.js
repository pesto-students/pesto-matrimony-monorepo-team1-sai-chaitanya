import { MessagesBox } from '../../components';
import styles from './mailBox.module.scss';
import { useEffect, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import _ from "lodash";
import { Empty, Spin } from 'antd';
import axios from 'axios';

const MailBox = () => {
  const { oktaAuth, authState } = useOktaAuth();
  const oktaIdOfLoggedInUser = authState.accessToken.claims.uid;

  const [interestsSentAndReceived, setInterestsSentAndReceived] = useState([]);
  const [responseForLoader, setResponseForLoader] = useState({});

  useEffect(() => {
    axios
      .get(`https://pmapi-pesto.herokuapp.com/api/v1/conversations/${oktaIdOfLoggedInUser}`)
      .then((res) => {
        console.log(res);
        setResponseForLoader(res);
        setInterestsSentAndReceived([...res.data.interestsReceived, ...res.data.interestsSent]);
      })
      .catch((error) => console.log(error));
  }, []);

  console.log(interestsSentAndReceived)

  const renderMailBox = interestsSentAndReceived?.map((interest, i) => {
    if (interest.conversations.length > 0) {
      return (
        <div key={Math.random()}>
          <MessagesBox
            idOfLoggedInUser={oktaIdOfLoggedInUser}
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

  if(_.isEmpty(responseForLoader)){
    return (<div>
     <h2 className={styles.pageHeading}>MailBox</h2>
      <Spin className={styles.pageLoaderSpin} size="large" />
    </div>)
  }


  return (
    <div className={styles.mailBox}>
      <h2 className={styles.pageHeading}>MailBox</h2>
      {renderMailBox.length < 1 ? (
        <Empty
          description={
            <span>
              No Messages Found.
            </span>
          }
        ></Empty>
      ) : (
        <div className={styles.content}>{renderMailBox}</div>
      )}
      
    </div>
  );
};

export default MailBox;

// const DUMMY_INTERESTS_ARRAY = [
//   {
//     interestSenderAge: 23,
//     interestSenderId: 'vishal',
//     interestSenderImage: 'http://placehold.jp/12/5c5fee/ffffff/40x40.png',
//     interestSenderName: 'Vishal',
//     interestReceiverAge: 22,
//     interestReceiverId: 'shivani',
//     interestReceiverImage: 'http://placehold.jp/12/573527/ffffff/40x40.png',
//     interestReceiverName: 'Shivani',
//     isAccepted: false,
//     isRejected: false,
//     conversations: [
//       { messageSenderId: 'vishal', messageReceiverId: 'shivani', message: 'Hello, Shivani.' },
//       { messageSenderId: 'shivani', messageReceiverId: 'vishal', message: 'Hello, Vishal.' },
//       { messageSenderId: 'vishal', messageReceiverId: 'shivani', message: 'Dummy message from Vishal.' },
//       { messageSenderId: 'vishal', messageReceiverId: 'shivani', message: 'Dummy message from Vishal.' },
//       { messageSenderId: 'shivani', messageReceiverId: 'vishal', message: 'Dummy message from Shivani.' },
//       { messageSenderId: 'shivani', messageReceiverId: 'vishal', message: 'Dummy message from Shivani.' },
//     ],
//   },
// ];
