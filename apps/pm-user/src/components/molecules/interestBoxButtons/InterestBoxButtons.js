import PropTypes from 'prop-types';
import { noop as _noop } from 'lodash';
import {
  AcceptDeclineButtons,
  DeclinedInfoButtons,
  ViewAndSendButtons,
} from '..';

const InterestBoxButtons = ({
  isRejected,
  isAccepted,
  idOfLoggedInUser,
  interestReceiverId,
  interestReceiverName,
  interestSenderId,
  acceptInterestHandler,
  deleteRejectedInterestHandler,
  rejectInterestHandler,
  sendNewMessageHandler,
  viewMessagesHandler,
}) => {
  let buttonsToDisplay = '';
  if (
    isRejected === false &&
    idOfLoggedInUser === interestSenderId &&
    isAccepted === false
  ) {
    // Buttons to be shown for sender of interest
    // Interest sender can send messages only if receiver accepts interest.
    buttonsToDisplay = `Wait for ${interestReceiverName} to accept interest.`;
  } else if (
    isAccepted === false &&
    idOfLoggedInUser === interestReceiverId &&
    isRejected === false
  ) {
    // buttons to be shown for receiver of interest
    buttonsToDisplay = (
      <AcceptDeclineButtons
        acceptInterestHandler={acceptInterestHandler}
        interestSenderId={interestSenderId}
        rejectInterestHandler={rejectInterestHandler}
      />
    );
  } else if (isRejected === false && isAccepted === true) {
    // receiver accepted interest
    buttonsToDisplay = (
      <ViewAndSendButtons
        sendNewMessageHandler={sendNewMessageHandler}
        viewMessagesHandler={viewMessagesHandler}
      />
    );
  } else if (isRejected === true) {
    // receiver rejected the interest.
    // There is option to delete the interest in the mailbox of both sender and receiver.
    buttonsToDisplay = (
      <DeclinedInfoButtons
        deleteRejectedInterestHandler={deleteRejectedInterestHandler}
        interestSenderId={interestSenderId}
        idOfLoggedInUser={idOfLoggedInUser}
      />
    );
  }
  return buttonsToDisplay;
};

InterestBoxButtons.propTypes = {
  isRejected: PropTypes.bool,
  isAccepted: PropTypes.bool,
  idOfLoggedInUser: PropTypes.string,
  interestReceiverId: PropTypes.string,
  interestReceiverName: PropTypes.string,
  interestSenderId: PropTypes.string,
  acceptInterestHandler: PropTypes.func,
  deleteRejectedInterestHandler: PropTypes.func,
  rejectInterestHandler: PropTypes.func,
  sendNewMessageHandler: PropTypes.func,
  viewMessagesHandler: PropTypes.func,
};
InterestBoxButtons.defaultProps = {
  isRejected: false,
  isAccepted: false,
  idOfLoggedInUser: 'fetchFromDB',
  interestReceiverId: 'receiverId',
  interestReceiverName: 'Not Specified',
  interestSenderId: 'senderId',
  acceptInterestHandler: _noop,
  deleteRejectedInterestHandler: _noop,
  rejectInterestHandler: _noop,
  sendNewMessageHandler: _noop,
  viewMessagesHandler: _noop,
};

export default InterestBoxButtons;
