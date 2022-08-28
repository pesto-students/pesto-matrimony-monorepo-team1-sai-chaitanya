import { useState, useRef } from 'react';
import { Button, ClearOutlined, Input, Modal, SendOutlined } from '../../atoms';
import { OldMessages, ViewAndSendButton } from '..';
import { showNotification } from '@pm/pm-ui';
import PropTypes from 'prop-types';
import styles from './messagesBox.module.scss';

// idOfLoggedInUser is the _id of the loggedin user.
const MessagesBox = ({
  conversations,
  idOfLoggedInUser,
  interestSenderAge,
  interestSenderId,
  interestSenderImage,
  interestSenderName,
  interestReceiverAge,
  interestReceiverId,
  interestReceiverImage,
  interestReceiverName,
}) => {
  const { TextArea } = Input;
  const messageRef = useRef();
  // Messaging Modal
  const [isMessagingModalVisible, setisMessagingModalVisible] = useState(false);

  const showMessagingModal = () => {
    setisMessagingModalVisible(true);
  };

  const handleNewMessageCancel = () => {
    setisMessagingModalVisible(false);
  };

  function sendNewMessageHandler() {
    showMessagingModal();
  }

  function sendMessageHandler() {
    const message = messageRef.current.resizableTextArea.props.value;
    console.log(message);
    // Connect with Backend and save this message inside both users.

    const messageReceiverName = idOfLoggedInUser === interestSenderId ? interestReceiverName : interestSenderName;
    if (message.trim().length > 0) {
      setTimeout(() => {
        handleNewMessageCancel();
        showNotification('success', 'Message Sent', `Relax! Your message has been sent to ${messageReceiverName}`, 0);
      }, 1500);
    } else {
      showNotification('warn', 'Error!', "Message can't be empty.");
    }
  }

  function imageClickHandler(idOfLoggedInUser, interestSenderId, interestReceiverId) {
    if (idOfLoggedInUser === interestSenderId) {
      // open profile in new tab
      window.open(`/profile/${interestReceiverId}`, '_blank');
      return;
    }
    // open profile in new tab
    window.open(`/profile/${interestSenderId}`, '_blank');
  }
  return (
    <>
      <div className={styles.messagesBox}>
        <div className={styles.profileImage}>
          <img
            src={idOfLoggedInUser === interestSenderId ? interestReceiverImage : interestSenderImage}
            alt={idOfLoggedInUser === interestSenderId ? interestReceiverName : interestSenderName}
            onClick={() => imageClickHandler(idOfLoggedInUser, interestSenderId, interestReceiverId)}
          />
        </div>
        <div className={styles.profileBrief}>
          {idOfLoggedInUser === interestSenderId
            ? `${interestReceiverName}, ${interestReceiverAge}`
            : `${interestSenderName}, ${interestSenderAge}`}
        </div>
        <div className={styles.buttons}>
          <ViewAndSendButton onClick={sendNewMessageHandler} />
        </div>
      </div>
      {/* Messaging Modal Start */}
      {isMessagingModalVisible && (
        <Modal
          title={`Sending Message to ${
            idOfLoggedInUser === interestSenderId ? interestReceiverName : interestSenderName
          }`}
          visible={isMessagingModalVisible}
          onCancel={handleNewMessageCancel}
          destroyOnClose={true}
          footer={null}
        >
          <h2 className={styles.heading}>Previous Messages:</h2>
          <OldMessages
            conversations={conversations}
            idOfLoggedInUser={idOfLoggedInUser}
            interestSenderImage={interestSenderImage}
            interestReceiverImage={interestReceiverImage}
          />
          <br />
          <h2 className={styles.heading}>Type your message below : </h2>
          <TextArea showCount maxLength={300} ref={messageRef} allowClear />
          <Button type="primary" shape="round" icon={<SendOutlined />} size="middle" onClick={sendMessageHandler}>
            Send Message
          </Button>
          <Button type="primary" shape="round" icon={<ClearOutlined />} size="middle" onClick={handleNewMessageCancel}>
            Cancel
          </Button>
        </Modal>
      )}
      {/* Messaging Modal End */}
    </>
  );
};

MessagesBox.propTypes = {
  conversations: PropTypes.array,
  idOfLoggedInUser: PropTypes.string,
  interestSenderAge: PropTypes.number,
  interestSenderId: PropTypes.string,
  interestSenderImage: PropTypes.string,
  interestSenderName: PropTypes.string,
  interestReceiverAge: PropTypes.number,
  interestReceiverId: PropTypes.string,
  interestReceiverImage: PropTypes.string,
  interestReceiverName: PropTypes.string,
};

MessagesBox.defaultProps = {
  conversations: [],
  idOfLoggedInUser: 'idOfLoggedInUser',
  interestSenderAge: 99,
  interestSenderId: 'interstSenderId',
  interestSenderImage: 'https://placehold.jp/40x40.png',
  interestSenderName: 'interestSenderName',
  interestReceiverAge: 99,
  interestReceiverId: 'interestReceiverId',
  interestReceiverImage: 'https://placehold.jp/40x40.png',
  interestReceiverName: 'interestReceiverName',
};

export default MessagesBox;
