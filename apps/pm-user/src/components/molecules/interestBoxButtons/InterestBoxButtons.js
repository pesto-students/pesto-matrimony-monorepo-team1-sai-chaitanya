import { noop as _noop } from 'lodash';
import { AcceptDeclineButtons, DeclinedInfoButtons, ViewAndSendButtons } from '..';
import PropTypes from 'prop-types';

const InterestBoxButtons = ({
  acceptInterestHandler,
  deleteRejectedInterestHandler,
  idOfLoggedInUser,
  interestReceiverId,
  interestReceiverName,
  interestSenderId,
  isAccepted,
  isRejected,
  rejectInterestHandler,
  sendNewMessageHandler,
}) => {
  let buttonsToDisplay = '';
  if (isRejected === false && idOfLoggedInUser === interestSenderId && isAccepted === false) {
    // Buttons to be shown for sender of interest
    // Interest sender can send messages only if receiver accepts interest.
    buttonsToDisplay = `Wait for ${interestReceiverName} to accept interest.`;
  } else if (isAccepted === false && idOfLoggedInUser === interestReceiverId && isRejected === false) {
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
    buttonsToDisplay = <ViewAndSendButtons sendNewMessageHandler={sendNewMessageHandler} />;
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
  acceptInterestHandler: PropTypes.func,
  deleteRejectedInterestHandler: PropTypes.func,
  idOfLoggedInUser: PropTypes.string,
  interestReceiverId: PropTypes.string,
  interestReceiverName: PropTypes.string,
  interestSenderId: PropTypes.string,
  isAccepted: PropTypes.bool,
  isRejected: PropTypes.bool,
  rejectInterestHandler: PropTypes.func,
  sendNewMessageHandler: PropTypes.func,
};
InterestBoxButtons.defaultProps = {
  acceptInterestHandler: _noop,
  deleteRejectedInterestHandler: _noop,
  idOfLoggedInUser: 'loggedInUserId',
  interestReceiverId: 'interestReceiverId',
  interestReceiverName: 'interestReceiverName',
  interestSenderId: 'interestSenderId',
  isAccepted: false,
  isRejected: false,
  rejectInterestHandler: _noop,
  sendNewMessageHandler: _noop,
};

export default InterestBoxButtons;
