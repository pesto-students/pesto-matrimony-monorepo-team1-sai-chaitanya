import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './interestBox.module.scss';
import { Button, Input, Modal } from '../../atoms';
import { showNotification } from '@pm/pm-ui';

import {
  ClearOutlined,
  DeleteOutlined,
  DislikeOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  LikeOutlined,
  ReadOutlined,
  SendOutlined,
} from '../../atoms/icon';
import AcceptDeclineButtons from '../acceptDeclineButtons/AcceptDeclineButtons';

// myId is the _id of the loggedin user.
const InterestBox = ({
  myId,
  fromName,
  fromId,
  fromAge,
  fromImage,
  toId,
  toName,
  toAge,
  toImage,
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
          `Relax! Your message has been sent to ${toName}`,
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
    history.push(`/profile/${fromId}`);
  }

  const viewAndSendButtons = (
    <MessagingButtons
      sendNewMessageHandler={sendNewMessageHandler}
      viewMessagesHandler={viewMessagesHandler}
    />
  );

  const acceptDeclineButtons = (
    <AcceptDeclineButtons
      acceptInterestHandler={acceptInterestHandler}
      fromId={fromId}
      rejectInterestHandler={rejectInterestHandler}
    />
  );

  const deleteRejectedInterestButton = (
    // if interest is declined, no messages can be sent.
    // only option is to delete the interest sent
    <>
      <Button type="text" danger icon={<ExclamationCircleOutlined />}>
        Your Interest was rejected!
      </Button>
      <Button
        danger
        type="text"
        shape="round"
        icon={<DeleteOutlined />}
        size="middle"
        onClick={deleteRejectedInterestHandler}
      >
        Delete
      </Button>
    </>
  );
  const deleteInterestDeclinedByMe = (
    // if interest is declined, no messages can be sent.
    // only option is to delete the interest sent
    <>
      <Button type="text" danger icon={<ExclamationCircleOutlined />}>
        You rejected this interest!
      </Button>
      <Button
        danger
        type="text"
        shape="round"
        icon={<DeleteOutlined />}
        size="middle"
        onClick={deleteRejectedInterestHandler}
      >
        Delete
      </Button>
    </>
  );

  let buttonsToDisplay = '';
  if (isRejected === false && myId === fromId && isAccepted === false) {
    // Buttons to be shown for sender of interest
    // Interest sender can send messages only if receiver accepts interest.
    buttonsToDisplay = `Wait for ${toName} to accept interest.`;
  } else if (isAccepted === false && myId === toId && isRejected === false) {
    // buttons to be shown for receiver of interest
    buttonsToDisplay = acceptDeclineButtons;
  } else if (isRejected === false && isAccepted === true) {
    // receiver accepted interest
    buttonsToDisplay = viewAndSendButtons;
  } else if (isRejected === true && myId === fromId) {
    // receiver rejected the interest.
    // There is option to delete the interest in the mailbox of both sender and receiver.
    buttonsToDisplay = deleteRejectedInterestButton;
  } else if (isRejected === true && myId === toId) {
    // receiver rejected the interest.
    // There is option to delete the interest in the mailbox of both sender and receiver.
    buttonsToDisplay = deleteInterestDeclinedByMe;
  }

  return (
    <>
      <div className={styles.interestBox}>
        <div>
          <img src={myId === fromId ? `${toImage}` : `${fromImage}`} />
        </div>
        <div>
          {myId === fromId ? `${toName}, ${toAge}` : `${fromName}, ${fromAge}`}
        </div>
        <div>{buttonsToDisplay}</div>
      </div>
      {isNewMessageModalVisible && (
        <Modal
          title={`Sending Message to ${toName}`}
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
          title={`Viewing Previous Conversation with ${toName}`}
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
                ({ message, fromId, fromImage, toId, toImage }) => {
                  return (
                    <div className={styles.message}>
                      <div>
                        <img src={fromId === myId ? fromImage : toImage} />
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
  myId: PropTypes.string,
  fromName: PropTypes.string,
  fromId: PropTypes.string,
  fromAge: PropTypes.number,
  fromImage: PropTypes.string,
  toId: PropTypes.string,
  toName: PropTypes.string,
  toAge: PropTypes.number,
  toImage: PropTypes.string,
  isAccepted: PropTypes.bool,
  isRejected: PropTypes.bool,
  conversations: PropTypes.array,
};

InterestBox.defaultProps = {
  myId: 'abc',
  fromName: 'Vishal',
  fromId: 'abc',
  fromAge: 23,
  fromImage: 'https://placehold.jp/150x150.png',
  toId: 'xyz',
  toName: 'Kavita',
  toAge: 22,
  toImage: 'https://placehold.jp/150x150.png',
  isAccepted: false,
  isRejected: false,
  conversations: [],
};

export default InterestBox;
