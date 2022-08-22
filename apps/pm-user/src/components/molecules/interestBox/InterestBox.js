import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './interestBox.module.scss';
import { Button, Input, Modal } from '../../atoms';
import { showNotification } from '@pm/pm-ui';
import { ClearOutlined, SendOutlined } from '../../atoms/icon';

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
    showNotification(
      'error',
      'Error!',
      'Error accepting the interest. Please try later.'
    );
  }
  function deleteRejectedInterestHandler() {
    // Do DB operation. delete interest object inside interests array
    // depending on who initiated this delete operation.

    // Then send notification about success / failure
    showNotification(
      'success',
      'Interest Deleted!',
      'Interest successfully deleted.'
    );
    showNotification(
      'error',
      'Error!',
      'Error deleting the interest. Please try again.'
    );
  }
  function rejectInterestHandler() {
    // Do DB operation. update isRejected to true for interest object inside of sender only.
    // Then delete the interest object in receiver

    // Then send notification about success / failure
    showNotification(
      'info',
      'Interest Declined!',
      'You will no longer receive messages from the sender.'
    );
    showNotification(
      'error',
      'Error!',
      'Error declining the interest. Please try later.'
    );
  }

  const messageRef = useRef();
  // New Message Modal
  const [isNewMessageModalVisible, setIsNewMessageModalVisible] =
    useState(false);

  const showNewMessageModal = () => {
    setIsNewMessageModalVisible(true);
  };

  const handleNewMessageCancel = () => {
    setIsNewMessageModalVisible(false);
  };

  function sendNewMessageHandler() {
    showNewMessageModal();
  }
  // Message History Modal
  const [
    isViewMessageHistoryModalVisible,
    setIsViewMessageHistoryModalVisible,
  ] = useState(false);

  const viewMessageHistoryModal = () => {
    setIsViewMessageHistoryModalVisible(true);
  };

  const hideMessageHistoryModal = () => {
    setIsViewMessageHistoryModalVisible(false);
  };

  function sendMessageHandler() {
    const message = messageRef.current.resizableTextArea.props.value;
    console.log(message);
    // Connect with Backend and save this message inside both users.
    if (message.trim().length > 0) {
      setTimeout(() => {
        handleNewMessageCancel();
        showNotification(
          'success',
          'Message Sent',
          `Relax! Your message has been sent to ${interestReceiverName}`,
          0
        );
      }, 1500);
    } else {
      showNotification('warn', 'Error!', "Message can't be empty.");
    }
  }
  function viewMessagesHandler() {
    viewMessageHistoryModal();
  }

  const history = useHistory();
  function viewProfileHandler() {
    history.push(`/profile/${interestSenderId}`);
  }

  return (
    <>
      <div className={styles.interestBox}>
        <div>
          <img
            src={
              idOfLoggedInUser === interestSenderId
                ? `${interestReceiverImage}`
                : `${interestSenderImage}`
            }
          />
        </div>
        <div>
          {idOfLoggedInUser === interestSenderId
            ? `${interestReceiverName}, ${interestReceiverAge}`
            : `${interestSenderName}, ${interestSenderAge}`}
        </div>
        <div>{buttonsToDisplay}</div>
      </div>
      {isNewMessageModalVisible && (
        <Modal
          title={`Sending Message to ${interestReceiverName}`}
          visible={isNewMessageModalVisible}
          onCancel={handleNewMessageCancel}
          destroyOnClose={true}
          footer={null}
        >
          <p>Type your message below : </p>
          <TextArea showCount maxLength={300} ref={messageRef} allowClear />
          <Button
            type="primary"
            shape="round"
            icon={<SendOutlined />}
            size="middle"
            onClick={sendMessageHandler}
          >
            Send Message
          </Button>
          <Button
            type="primary"
            shape="round"
            icon={<ClearOutlined />}
            size="middle"
            onClick={handleNewMessageCancel}
          >
            Cancel
          </Button>
        </Modal>
      )}
      {isViewMessageHistoryModalVisible && (
        <Modal
          title={`Viewing Previous Conversation with ${interestReceiverName}`}
          visible={isViewMessageHistoryModalVisible}
          onCancel={hideMessageHistoryModal}
          destroyOnClose={true}
          footer={null}
        >
          {conversations.length === 0 ? (
            <p>No Messages.</p>
          ) : (
            <div>
              {conversations.map(
                ({
                  message,
                  interestSenderId,
                  interestSenderImage,
                  interestReceiverId,
                  interestReceiverImage,
                }) => {
                  return (
                    <div className={styles.message}>
                      <div>
                        <img
                          src={
                            interestSenderId === idOfLoggedInUser
                              ? interestSenderImage
                              : interestReceiverImage
                          }
                        />
                      </div>
                      <div>{message}</div>
                    </div>
                  );
                }
              )}
            </div>
          )}

          <Button
            type="primary"
            shape="round"
            icon={<ClearOutlined />}
            size="middle"
            onClick={hideMessageHistoryModal}
          >
            Close
          </Button>
        </Modal>
      )}
    </>
  );
};

InterestBox.PropTypes = {
  idOfLoggedInUser: PropTypes.string,
  interestSenderName: PropTypes.string,
  interestSenderId: PropTypes.string,
  interestSenderAge: PropTypes.number,
  interestSenderImage: PropTypes.string,
  interestReceiverId: PropTypes.string,
  interestReceiverName: PropTypes.string,
  interestReceiverAge: PropTypes.number,
  interestReceiverImage: PropTypes.string,
  isAccepted: PropTypes.bool,
  isRejected: PropTypes.bool,
  conversations: PropTypes.array,
};

InterestBox.defaultProps = {
  idOfLoggedInUser: 'abc',
  interestSenderName: 'Vishal',
  interestSenderId: 'abc',
  interestSenderAge: 23,
  interestSenderImage: 'https://placehold.jp/150x150.png',
  interestReceiverId: 'xyz',
  interestReceiverName: 'Kavita',
  interestReceiverAge: 22,
  interestReceiverImage: 'https://placehold.jp/150x150.png',
  isAccepted: false,
  isRejected: false,
  conversations: [],
};

export default InterestBox;
