import { useState, useRef } from 'react';
import { Button, ClearOutlined, Input, Modal, SendOutlined } from '../../atoms';
import { InterestBoxButtons, OldMessages } from '..';
import { showNotification } from '@pm/pm-ui';
import PropTypes from 'prop-types';
import styles from './interestBox.module.scss';

// idOfLoggedInUser is the _id of the loggedin user.
const InterestBox = ({
  idOfLoggedInUser,
  interestSenderName,
  interestSenderId,
  interestSenderAge,
  interestSenderImage,
  interestReceiverId,
  interestReceiverName,
  interestReceiverAge,
  interestReceiverImage,
  isAccepted,
  isRejected,
  conversations,
}) => {
  const { TextArea } = Input;
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
  function deleteRejectedInterestHandler() {
    // Do DB operation. delete interest object inside interests array
    // depending on who initiated this delete operation.

    // Then send notification about success / failure
    showNotification('success', 'Interest Deleted!', 'Interest successfully deleted.');
    showNotification('error', 'Error!', 'Error deleting the interest. Please try again.');
  }
  function rejectInterestHandler() {
    // Do DB operation. update isRejected to true for interest object inside of sender only.
    // Then delete the interest object in receiver

    // Then send notification about success / failure
    showNotification('info', 'Interest Declined!', 'You will no longer receive messages from the sender.');
    showNotification('error', 'Error!', 'Error declining the interest. Please try later.');
  }

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
  // Message History Modal
  // const [isViewMessageHistoryModalVisible, setIsViewMessageHistoryModalVisible] = useState(false);

  // const viewMessageHistoryModal = () => {
  //   setIsViewMessageHistoryModalVisible(true);
  // };

  // const hideMessageHistoryModal = () => {
  //   setIsViewMessageHistoryModalVisible(false);
  // };

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
      window.open(`/profile/${interestReceiverId}`, "_blank");
      return;
    }
    // open profile in new tab
    window.open(`/profile/${interestSenderId}`, "_blank");
  }
  console.log(idOfLoggedInUser);
  return (
    <>
      <div className={styles.interestBox}>
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
          <InterestBoxButtons
            isRejected={isRejected}
            isAccepted={isAccepted}
            idOfLoggedInUser={idOfLoggedInUser}
            interestReceiverId={interestReceiverId}
            interestReceiverName={interestReceiverName}
            interestSenderId={interestSenderId}
            interestSenderName={interestSenderName}
            acceptInterestHandler={acceptInterestHandler}
            deleteRejectedInterestHandler={deleteRejectedInterestHandler}
            rejectInterestHandler={rejectInterestHandler}
            sendNewMessageHandler={sendNewMessageHandler}
          />
        </div>
      </div>
      {/* Messaging Modal Start */}
      {isMessagingModalVisible && (
        <Modal
          title={`Sending Message to ${idOfLoggedInUser === interestSenderId ? interestReceiverName : interestSenderName}`}
          visible={isMessagingModalVisible}
          onCancel={handleNewMessageCancel}
          destroyOnClose={true}
          footer={null}
        >
          <h2 className={styles.heading}>Previous Messages:</h2>
          <OldMessages conversations={conversations} idOfLoggedInUser={idOfLoggedInUser} interestSenderImage={interestSenderImage} interestReceiverImage={interestReceiverImage} />
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

      {/* Message History Modal Start */}
      {/* {isViewMessageHistoryModalVisible && (
        <Modal
          title={`Viewing Previous Conversation with ${interestReceiverName}`}
          visible={isViewMessageHistoryModalVisible}
          onCancel={hideMessageHistoryModal}
          destroyOnClose={true}
          footer={null}
        >
          {conversations.length === 0 ? <p>No Messages.</p> : <PreviousConversations />}

          <Button type="primary" shape="round" icon={<ClearOutlined />} size="middle" onClick={hideMessageHistoryModal}>
            Close
          </Button>
        </Modal>
      )} */}
      {/* Message History Modal End */}
    </>
  );
};

// InterestBox.propTypes = {
//   idOfLoggedInUser: PropTypes.string,
//   interestSenderName: PropTypes.string,
//   interestSenderId: PropTypes.string,
//   interestSenderAge: PropTypes.number,
//   interestSenderImage: PropTypes.string,
//   interestReceiverId: PropTypes.string,
//   interestReceiverName: PropTypes.string,
//   interestReceiverAge: PropTypes.number,
//   interestReceiverImage: PropTypes.string,
//   isAccepted: PropTypes.bool,
//   isRejected: PropTypes.bool,
//   conversations: PropTypes.array,
// };

// InterestBox.defaultProps = {
//   idOfLoggedInUser: 'abc',
//   interestSenderName: 'Vishal',
//   interestSenderId: 'abc',
//   interestSenderAge: 23,
//   interestSenderImage: 'https://placehold.jp/150x150.png',
//   interestReceiverId: 'xyz',
//   interestReceiverName: 'Kavita',
//   interestReceiverAge: 22,
//   interestReceiverImage: 'https://placehold.jp/150x150.png',
//   isAccepted: false,
//   isRejected: true,
//   conversations: [],
// };

export default InterestBox;
